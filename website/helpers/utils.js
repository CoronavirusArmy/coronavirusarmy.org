import { toast } from "react-toastify"

export const toastError = err => {
    if(Array.isArray(err)) {
        err.forEach(e => {
            toast.error(e.description);
        });
    } else {
        toast.error(err.message ? err.message : err);
    }
}

export const hasError = (errors, field) => {
    if(!errors || !Array.isArray(errors))
        return false;
    else {
        const error = errors.find(e => e.field === field);
        if(error)
            return error.description;
        else
            return false;
    }
}

export const range = (start, end) => {
    return Array.from(Array(end - start + 1), (_, i) => i + start); 
}

export const getBase64 = file => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}