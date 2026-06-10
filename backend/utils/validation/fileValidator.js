async function VerifMIME(filePathExact) {
    const { fileTypeFromFile } = await import('file-type');
    const fileMeta = await fileTypeFromFile(filePathExact);
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac', 'audio/x-flac'];
    
    return (!fileMeta || !allowedTypes.includes(fileMeta.mime));
}
function ValidarBpm(bpm_) {
        // 1. Si es undefined, null o un texto vacío, es inválido
        if (bpm_ === undefined || bpm_ === null || String(bpm_).trim() === "") {
            return false;
        }

        const bpm = Number(bpm_);
        const minbpm = 20;
        const maxbpm = 300;

        // 2. Si no es un número entero o está fuera de rango, es inválido
        if (isNaN(bpm) || !Number.isInteger(bpm) || bpm < minbpm || bpm > maxbpm) {
            return false;
        }
        // 3. Si pasó todos los filtros, es válido
        return true;
}
module.exports= { ValidarBpm,VerifMIME};