import JSZip from "jszip";
import {saveAs} from 'file-saver';

export async function export_zip(data) {
    var zip = new JSZip();
    data = {...data};
    data.name = data.name || "E-Signage";
    data.windows = {...data.windows};

    let folder = zip.folder('file');

    let saved_file = [];

    for (let channel in data.windows) {
        data.windows[channel] = data.windows[channel].map(i => ({...i}));

        data.windows[channel].forEach(item => {
            if (!saved_file.includes(item.file.name)) {
                folder.file(item.file.name, item.file, {
                    compression: "STORE"
                });
                saved_file.push(item.file.name);
            }
            item.file = item.file.name;
        })
    }

    zip.file("data.json", JSON.stringify(data));

    let zip_blob = await zip.generateAsync({type: "blob"})

    saveAs(zip_blob, `${data.name}.zip`);
}

export async function import_zip(zip_file) {
    let zip = await JSZip.loadAsync(zip_file);
    let json = await zip.file('data.json').async('string');
    let data = JSON.parse(json);
    let folder = zip.folder('file');
    let p = [];
    let file_map = new Map();
    for (let channel in data.windows) {
        p = data.windows[channel].map(async (item) => {
            let file_type;
            let filename = item.file;
            if (item.is_image) {
                file_type = 'image/';
            }
            if (item.is_video) {
                file_type = 'video/';
            }
            file_type += filename.split('.').pop()

            if (file_map.has(filename)) {
                item.file = file_map.get(filename);
            } else {
                item.file = await folder.file(`${item.file}`).async('blob');
                item.file = new File([item.file], filename, {
                    type: file_type
                })
                file_map.set(filename, item.file);
            }
            item.url = URL.createObjectURL(item.file);
        }).concat(p);
    }

    await Promise.all(p);

    // console.log(data);

    return data;
}

export function open_file_picker() {
    return new Promise(resolve => {
        let input = document.createElement('input');
        input.type = "file";
        input.accept = '.zip';
        input.oncancel = () => {
            resolve(null);
        }
        input.onchange = () => {
            resolve(input.files.length ? input.files[0] : null)
        };
        input.click();
    })
}