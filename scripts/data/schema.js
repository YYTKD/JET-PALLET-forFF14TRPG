export const schema = {
    version: '0.1.0',
    entities: {
        character: {
            id: 'string',
            name: 'string',
            job: 'string',
            level: 'number',
            resources: 'array',
        },
        ability: {
            id: 'string',
            name: 'string',
            category: 'string',
            cooldown: 'number',
            tags: 'array',
        },
        buff: {
            id: 'string',
            name: 'string',
            duration: 'string',
            effect: 'string',
        },
    },
};
