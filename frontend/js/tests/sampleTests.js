/**
 * Función para asegurar independencia de los tests de samples
 * y no depender de otro test para tener un token de sesión válido
 */
 async function okLogin()
 {
    // 1. Login como productor (pepe) para obtener un token válido
     const response = await fetch('/api/auth/login', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ username: 'pepe', password: '123456' }) // Usamos pepe hardcodeado
     });
     const data = await response.json();
     // Guardamos el token para tests de samples
     localStorage.setItem('test_token', data.token);
 }

/**
 * Test: GET /api/samples/my-samples
 */
 testUtils.createTestButton("Test Listar Mis Samples", async (btn) => {
    // 1. Asegurar y guardar una sesión válida
    await okLogin();
    const token = localStorage.getItem('test_token');

    // 2. Realizar la petición
    const response = await fetch('/api/samples/my-samples', {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();
    testUtils.log(data);
    if (response.ok) testUtils.setSuccess(btn);
});

/**
 * Test: POST /api/samples/upload
 */
testUtils.createTestButton("Test Subir Sample (Simulado)", async (btn) => {
    // 1. Asegurar y guardar una sesión válida
    await okLogin();
    const token = localStorage.getItem('test_token');

    // 2. Obtener archivo de audio real desde la carpeta de tests
    const audioResponse = await fetch('/js/tests/DRUM_LOOP_01.wav');
    const audioBlob = await audioResponse.blob();

    // 3. Crear FormData con el archivo real
    const formData = new FormData();
    formData.append('display_name', 'Test Loop Pedagogico');
    formData.append('category', 'Drums');
    formData.append('bpm', '120');
    formData.append('audioFile', audioBlob, 'DRUM_LOOP_01.wav');

    // 4. Subir el sample
    const response = await fetch('/api/samples/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });

    const data = await response.json();
    testUtils.log(data);

    if (response.ok) {
        // 5. Limpiar: eliminar el sample que acabamos de subir
        const sampleId = data.id;
        await fetch(`/api/samples/${sampleId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        testUtils.setSuccess(btn);
    }
});
/*
    TEST ARCHIVO PESADO
*/

testUtils.createTestButton("Test Archivo Limite Peso", async (btn) => {
    await okLogin();
    const token = localStorage.getItem("test_token");

    const size = 10 * 1024 * 1024 + 1;

    const audioResponse = await fetch('/js/tests/DRUM_LOOP_01.wav');
    const audioBlob = await audioResponse.blob();

    const bigBlob = new Blob([audioBlob, new Uint8Array(size - audioBlob.size)], { type: 'audio/wav' });
    const formData = new FormData();

    formData.append("audioFile", bigBlob, "PruebaGrande.wav");
    formData.append('display_name', 'Test Loop Pedagogico');
    formData.append('category', 'Drums');
    formData.append('bpm', '120');

    const response = await fetch('/api/samples/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });

    const data = await response.json();
    testUtils.log(data);
    if (response.status === 413 || response.status === 500) testUtils.setSuccess(btn);
});

testUtils.createTestButton("Test Tipo de Archivo Incorrecto", async(btn) =>{
    await okLogin();
    const token = localStorage.getItem('test_token');

    const formData = new FormData();
    formData.append('display_name', 'Test Loop Pedagogico');
    formData.append('category', 'Drums');
    formData.append('bpm', '120');

    const ContenidoMalicioso = "SoyVirus";

    // Simulamos un archivo WAV (binario vacío para la prueba)
    const blob = new Blob(["ContenidoMalisioso"], { type: 'audio/wav' });
    formData.append('audioFile', blob, 'DRUM_LOOP_01.wav');

    const response = await fetch('/api/samples/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });

    const data = await response.json();
    testUtils.log(data);
    if (response.status === 415) testUtils.setSuccess(btn);
});
