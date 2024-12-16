import { json } from '@sveltejs/kit';
import { hash, verify } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

function validateUsername(username: string | null): username is string {
	return typeof username === 'string' && username.length >= 3 && username.length <= 31;
}

function validatePassword(password: string | null): password is string {
	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}

function generateUserId() {
	const bytes = crypto.getRandomValues(new Uint8Array(20));
	const id = encodeBase32LowerCase(bytes);
	return id;
}

export async function POST({ request, cookies }) {
    const { action, ...data } = await request.json();

    if (action === 'login') {
        const { username, password } = data;

        if (!validateUsername(username)) {
            return json({ error: 'Invalid username' }, { status: 400 });
        }
        if (!validatePassword(password)) {
            return json({ error: 'Invalid password' }, { status: 400 });
        }

        const results = await db.select().from(table.user).where(eq(table.user.username, username));
        const existingUser = results.at(0);

        if (!existingUser) {
            return json({ error: 'Incorrect username or password' }, { status: 400 });
        }

        const validPassword = await verify(existingUser.passwordHash, password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        });

        if (!validPassword) {
            return json({ error: 'Incorrect username or password' }, { status: 400 });
        }

        const sessionToken = auth.generateSessionToken();
        const session = await auth.createSession(sessionToken, existingUser.id);
        
        // Set the cookie directly
        cookies.set(auth.sessionCookieName, sessionToken, {
            path: '/',
            expires: session.expiresAt
        });

        const { passwordHash, ...safeUser } = existingUser;
        return json({ success: true, user: safeUser });
    }

    if (action === 'register') {
        const { username, password } = data;

        if (!validateUsername(username)) {
            return json({ error: 'Invalid username' }, { status: 400 });
        }
        if (!validatePassword(password)) {
            return json({ error: 'Invalid password' }, { status: 400 });
        }

        const results = await db.select().from(table.user).where(eq(table.user.username, username));
        const existingUser = results.at(0);

        if (existingUser) {
            return json({ error: 'Username already taken' }, { status: 400 });
        }

        const userId = generateUserId();
        const passwordHash = await hash(password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        });

        const user = await db
            .insert(table.user)
            .values({
                id: userId,
                username,
                passwordHash
            })
            .returning()
            .get();

        const sessionToken = auth.generateSessionToken();
        const session = await auth.createSession(sessionToken, user.id);
        
        // Set the cookie directly
        cookies.set(auth.sessionCookieName, sessionToken, {
            path: '/',
            expires: session.expiresAt
        });

        const { passwordHash: _, ...safeUser } = user;
        return json({ success: true, user: safeUser });
    }

    if (action === 'logout') {
        cookies.delete(auth.sessionCookieName, { path: '/' });
        return json({ success: true });
    }

    return json({ error: 'Invalid action' }, { status: 400 });
}
