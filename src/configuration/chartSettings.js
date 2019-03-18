export default function chartSettings() {
    return {
        x: {
            column: 'shiftx',
            type: 'linear',
            label: 'Baseline Value',
            format: '0.2f'
        },
        y: {
            column: 'shifty',
            type: 'linear',
            label: 'Comparison Value',
            behavior: 'flex',
            format: '0.2f'
        },
        marks: [
            {
                type: 'circle',
                per: ['key'],
                radius: 4,
                attributes: {
                    'stroke-width': 0.5,
                    'fill-opacity': 0.8
                },
                tooltip:
                    'Subject ID: [key]\nBaseline: [shiftx]\nComparison: [shifty]\nChange: [chg]\nPercent Change: [pchg]'
            }
        ],
        gridlines: 'xy',
        resizable: false,
        margin: { right: 25, top: 25 },
        aspect: 1
    };
}
