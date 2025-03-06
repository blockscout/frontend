// 是否是生产环境
const isProduction = process.env.NODE_ENV === 'production';
// 开发环境baseUrl
const baseUrl = isProduction ? '/nestapi/machine' : 'http://localhost:3001/machine';

// 获取机器列表数据
export async function fetchMachineData(address: any) {
  // const url = `/nestapi/machine?address=${encodeURIComponent(address)}`;
  const url = `${baseUrl}?address=${encodeURIComponent(address)}`;

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
  // const url = '/nestapi/machine';

  const url = baseUrl;

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

// 删除机器
export async function deleteMachine(id: any) {
  // /nestapi/machine
  try {
    const response = await fetch(`${baseUrl}/?id=${id}`, {
      method: 'DELETE', // 指定 DELETE 方法
      headers: {
        'Content-Type': 'application/json', // 可选，视后端要求
      },
    });

    if (!response.ok) {
      throw new Error(`删除失败: ${response.status} ${response.statusText}`);
    }

    const result = await response.json(); // 假设后端返回 JSON 数据
    console.log('删除成功:', result);
    return result;
  } catch (error: any) {
    console.error('删除机器出错:', error.message);
    throw error;
  }
}
