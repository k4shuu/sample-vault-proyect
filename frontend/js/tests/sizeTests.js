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
