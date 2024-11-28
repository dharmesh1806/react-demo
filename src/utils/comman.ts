
export function validateString(str: string, msg: string) {
    if (str == "" || str == null || str == undefined)
        throw msg
}

export function validateEmail(str: string, msg: string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(str))
        throw msg
}

export function validateLenght(str: string, minlen: number, msg: string) {
    if (str.length < minlen)
        throw msg
}

export function validateFile(file: any, size: number, msg: string) {
    let ext = ['png', 'jpg', 'jpeg']
    if (file.length == 0) {
        throw msg
    }
    for (let f of file) {
        if (ext.indexOf(f.name.split('.')[1]) == -1) {
            throw msg + " with type png, jpg or jpeg"
        }
        if (parseInt(f.size) / 1024 / 1024 > size) {
            throw msg + " with maximum size of " + size + ' mb'
        }
    }
}