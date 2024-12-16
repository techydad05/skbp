// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
            session: any; // Adjust this type based on your session structure
        }		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
