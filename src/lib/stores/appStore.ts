import { writable } from 'svelte/store';

export interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

export interface TechDetail {
    title: string;
    description: string;
    features: string[];
    codeExample: string;
}

function createTodoStore() {
    const { subscribe, set, update } = writable<Todo[]>([
        { id: 1, text: 'Learn Svelte', completed: true },
        { id: 2, text: 'Master Skeleton UI', completed: false },
        { id: 3, text: 'Build awesome app', completed: false }
    ]);

    return {
        subscribe,
        add: (text: string) => update(todos => [...todos, { id: Math.max(0, ...todos.map(t => t.id)) + 1, text, completed: false }]),
        toggle: (id: number) => update(todos => todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )),
        remove: (id: number) => update(todos => todos.filter(todo => todo.id !== id)),
        reset: () => set([])
    };
}

export const todos = createTodoStore();

// Theme store
export const currentTheme = writable<string>('skeleton');

export const techDetails = writable<Record<string, TechDetail>>({
    'SvelteKit': {
        title: 'SvelteKit - The Full Stack Framework',
        description: 'Build blazing fast web apps with Svelte\'s next-gen application framework',
        features: [
            'Zero-config deployment',
            'Server-side rendering',
            'API routes built-in',
            'Filesystem-based routing'
        ],
        codeExample: `
// routes/+page.svelte
<script>
    export let data;
</script>

<h1>{data.title}</h1>
`
    },
    'Skeleton': {
        title: 'Skeleton UI - Beautiful Components',
        description: 'A UI toolkit that combines the power of Svelte, Tailwind, and modern design principles',
        features: [
            'Dark mode support',
            'Customizable themes',
            'Rich component library',
            'Tailwind integration'
        ],
        codeExample: `
<script>
    import { AppBar } from '@skeletonlabs/skeleton';
</script>

<AppBar>
    <h2>My App</h2>
</AppBar>
`
    },
    'TypeScript': {
        title: 'TypeScript - Type-Safe Development',
        description: 'Write better code with TypeScript\'s powerful type system',
        features: [
            'Static type checking',
            'IDE integration',
            'Early error detection',
            'Better refactoring'
        ],
        codeExample: `
interface User {
    id: number;
    name: string;
}

function greet(user: User) {
    console.log(\`Hello, \${user.name}!\`);
}
`
    },
    'Tailwind': {
        title: 'Tailwind CSS - Utility-First Framework',
        description: 'Build modern designs without leaving your HTML',
        features: [
            'Utility-first approach',
            'Responsive design',
            'Custom configurations',
            'JIT compilation'
        ],
        codeExample: `
<div class="flex items-center 
    justify-between p-4 
    bg-surface-100-800-token">
    <h1 class="text-2xl font-bold">
        Hello World
    </h1>
</div>
`
    }
});
