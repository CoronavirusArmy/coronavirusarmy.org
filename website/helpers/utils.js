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

export const formatTime = (_seconds, _prepend, _isTime = false) => {
    if(_isTime)
        if(!_seconds || _seconds == 0)
            return '00:00:00'
    else 
        if(!_seconds || _seconds == 0)
            return '0h 0m'
    
    let prepend0 = (_val) => {
        return _val < 10 ? `0${_val}` : _val
    }
    let hours   = Math.floor(_seconds / 3600)
    let mins = Math.floor((_seconds - (hours * 3600)) / 60)
    let secs = Math.floor((_seconds - ((hours * 3600) + (mins * 60))))

    if(_isTime) {
        if(_prepend)
            return `${prepend0(hours)}:${prepend0(mins)}:${prepend0(secs)}`
        else
            return `${hours}:${mins}:${secs}`
    } else {
        if(_prepend)
            return `${prepend0(hours)}h ${prepend0(mins)}m ${prepend0(secs)}s`
        else
            return `${hours}h ${mins}m ${secs}s`
    }
}