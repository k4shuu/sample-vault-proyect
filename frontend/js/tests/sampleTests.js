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
         body: JSON.stringify({ username: 'pepe', password: '12345' }) // Usamos pepe hardcodeado
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
 * Test: POST /api/samples/upload (Simulado)
 */
testUtils.createTestButton("Test Subir Sample (Simulado)", async (btn) => {
    // 1. Asegurar y guardar una sesión válida
    await okLogin();
    const token = localStorage.getItem('test_token');
    
    // Creamos un FormData
    const formData = new FormData();
    formData.append('display_name', 'Test Loop Pedagogico');
    formData.append('category', 'Drums');
    formData.append('bpm', '120');

    // Simulamos un archivo WAV (binario vacío para la prueba)
    const blob = new Blob(["Simulated Audio Content"], { type: 'audio/wav' });
    formData.append('audioFile', blob, 'DRUM_LOOP_01.wav');

    const response = await fetch('/api/samples/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });

    const data = await response.json();
    testUtils.log(data);
    if (response.ok) testUtils.setSuccess(btn);
});
testUtils.createTestButton("Test Subir Sample - Error por bpm invalido", async (btn) => {
        // 1. Asegurar sesión válida y obtener token
        await okLogin();
        const token = localStorage.getItem('test_token');
        
        // 2. Crear el FormData con el error a propósito 
        const formData = new FormData();
        formData.append('display_name', 'Test Loop Pedagogico');
        formData.append('category', 'Drums');
        formData.append('bpm', '   '); 

        const blob = new Blob(["Simulated Audio Content"], { type: 'audio/wav' });
        formData.append('audioFile', blob, 'DRUM_LOOP_01.wav');

        // 3. ENVIAR LA PETICIÓN AL BACKEND 
        const response = await fetch('/api/samples/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
                // NOTA: Con FormData NO se pone 'Content-Type', el navegador lo gestiona solo con Multer
            },
            body: formData
        });

        // 4. ANALIZAR LA RESPUESTA DEL BACKEND
        if (response.status === 400) {
            const data = await response.json();
            testUtils.log(`Respuesta correcta del servidor (Status 400): ${data.message || 'BPM inválido'}`);
            testUtils.setSuccess(btn); 
        } else {
            testUtils.log(`Fallo el test: Se esperaba un Status 400 pero se recibió un Status ${response.status}`);
        }
});