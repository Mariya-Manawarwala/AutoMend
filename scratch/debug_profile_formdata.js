const testUpdateFormData = async () => {
  try {
    const loginRes = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test_fixed@example.com',
        password: 'password123'
      })
    });
    
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log("Logged in, token received");

    // Constructing Multipart/form-data manually
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    const body = [
      `--${boundary}`,
      'Content-Disposition: form-data; name="name"',
      '',
      'Debug Form Data Test',
      `--${boundary}--`,
      ''
    ].join('\r\n');

    const updateRes = await fetch('http://localhost:8080/api/profile/update', {
      method: 'PUT',
      headers: { 
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Authorization': `Bearer ${token}` 
      },
      body: body
    });
    
    const updateData = await updateRes.json();
    console.log("Status:", updateRes.status);
    console.log("Update Data:", JSON.stringify(updateData, null, 2));
  } catch (error) {
    console.error("Update Failed!", error);
  }
};

testUpdateFormData();
