export const defaultData = {
    character: {
        id: 'character-001',
        name: 'モンク',
        job: 'MONK',
        level: 50,
        resources: [
            { id: 'resource-001', name: '闘気', current: 2, max: 5, type: 'stack' },
            { id: 'resource-002', name: 'MP', current: 30, max: 100, type: 'gauge' },
        ],
    },
    abilities: [
        {
            id: 'ability-001',
            name: 'ドラゴンキック',
            category: 'MAIN',
            cooldown: 0,
            tags: ['物理', 'メイン'],
        },
        {
            id: 'ability-002',
            name: '鉄山靠',
            category: 'OTHER',
            cooldown: 1,
            tags: ['特殊'],
        },
    ],
    buffs: [
        {
            id: 'buff-001',
            name: 'オーバーパワー',
            duration: '1T',
            effect: 'メインアビリティのダメージに+2',
        },
    ],
};
