const testUpdate = async () => {
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

    const updateRes = await fetch('http://localhost:8080/api/profile/update', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ name: 'Debug Test Script Fetch' })
    });
    
    const updateData = await updateRes.json();
    console.log("Status:", updateRes.status);
    console.log("Update Data:", JSON.stringify(updateData, null, 2));
  } catch (error) {
    console.error("Update Failed!", error);
  }
};

testUpdate();
