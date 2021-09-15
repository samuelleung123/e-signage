export const layout_windows = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '4': ['1', '2', '3', '4'],
};

export const Channels = ['1', '2', '3', '4'];

export function is_in_use(layout, channel) {
    return layout_windows[`${layout}`].includes(`${channel}`)
}