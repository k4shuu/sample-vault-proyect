async function VerifMIME(filePathExact) {
    const { fileTypeFromFile } = await import('file-type');
    const fileMeta = await fileTypeFromFile(filePathExact);
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac', 'audio/x-flac'];
    
    return (!fileMeta || !allowedTypes.includes(fileMeta.mime));
}

module.exports = { VerifMIME };