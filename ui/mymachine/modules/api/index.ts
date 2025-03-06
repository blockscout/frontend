// 获取机器列表数据
export async function fetchMachineData(address: any) {
  const url = `/nestapi/machine?address=${encodeURIComponent(address)}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data; // 返回数据
  } catch (error) {
    console.error('Error fetching machine data:', error);
    throw error; // 抛出错误，供调用者处理
  }
}

// 创建机器
export async function createMachine(req: any) {
  const url = '/nestapi/machine';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data; // 返回创建结果
  } catch (error) {
    console.error('Error creating machine:', error);
    throw error; // 抛出错误，供调用者处理
  }
}
