import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

export async function load({ locals }) {
	if (!locals.session) {
		throw redirect(302, '/auth');
	}

	const results = await db
		.select()
		.from(table.user)
		.where(eq(table.user.id, locals.session.userId));
	
	const user = results.at(0);
	if (!user) {
		throw redirect(302, '/auth');
	}

	const { passwordHash, ...safeUser } = user;
	return { user: safeUser };
}

export const actions = {
	updateProfile: async (event) => {
		const session = event.locals.session;
		if (!session) {
			return fail(401, { message: 'Not authenticated' });
		}

		const formData = await event.request.formData();
		const displayName = formData.get('displayName')?.toString() || '';
		const bio = formData.get('bio')?.toString() || '';

		try {
			await db
				.update(table.user)
				.set({ 
					displayName: displayName || null,
					bio: bio || null
				})
				.where(eq(table.user.id, session.userId));

			return { success: true };
		} catch (e) {
			return fail(500, { message: 'Failed to update profile' });
		}
	}
};
