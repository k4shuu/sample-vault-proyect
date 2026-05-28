testUtils.createTestButton("Test Tipo de Archivo Incorrecto", async(btn) =>{
    await okLogin();
    const token = localStorage.getItem('test_token');

    const formData = new FormData();
    formData.append('display_name', 'Test Loop Pedagogico');
    formData.append('category', 'Drums');
    formData.append('bpm', '120');

    const ContenidoMalisioso = "SoyVirus";

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