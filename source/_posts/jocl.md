---
title: 用JOCL做GPU编程
date: 2018-07-23 19:46:46
tags:
- gpu
- java
---

## JOCL 介绍
jocl实际上就是对opencl用java语言进行了封装，许多代码都和opencl一样，这一点使得用过opencl的可以非常快的上手，可以到github查看[源码](https://github.com/gpu/JOCL)

由于java没有指针，所以jocl不得不用Pointer来获取地址，这样就感觉jocl其实看起来比opencl还要复杂

## JOCL 开发环境搭建
参考别人的文章<https://my.oschina.net/qutterrtl/blog/1531327> 完成jocl开发环境搭建
1. 更新显卡驱动
2. 安装opencl驱动，应该最新版本的显卡驱动都是支持opencl的，可以用 GPU Caps Viewer 来测试，如果没有，AMD的话可以到<https://support.amd.com/en-us/kb-articles/Pages/OpenCL2-Driver.aspx> 下载驱动
3. 下载opencl sdk
    - Inter <https://software.intel.com/en-us/intel-opencl/download>
    - AMD <https://developer.amd.com/tools-and-sdks>
    - Nvidia <https://developer.nvidia.com/opencl>
4. 下载安装jdk <http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html>，不要忘了设置环境变量
5. 下载安装eclipse <http://www.eclipse.org/downloads/eclipse-packages>
6. 下载jar包 <http://www.jocl.org/downloads/downloads.html>，需要提取里面的相应jar文件放到项目Referenced Libraries里面，把dll文件放到jdk安装路径/bin下
7. 现在可以直接到官网 <http://www.jocl.org/samples/samples.html> 找sample来运行了

## 封装JOCL

原始的jocl就是对opencl的C语言的重写，是比较麻烦的，下面给出封装代码

PackJocl.java

``` java
package jocl;

import static org.jocl.CL.CL_CONTEXT_PLATFORM;
import static org.jocl.CL.CL_DEVICE_TYPE_GPU;
import static org.jocl.CL.CL_MEM_COPY_HOST_PTR;
import static org.jocl.CL.CL_MEM_READ_ONLY;
import static org.jocl.CL.CL_TRUE;
import static org.jocl.CL.clBuildProgram;
import static org.jocl.CL.clCreateBuffer;
import static org.jocl.CL.clCreateCommandQueue;
import static org.jocl.CL.clCreateContext;
import static org.jocl.CL.clCreateKernel;
import static org.jocl.CL.clCreateProgramWithSource;
import static org.jocl.CL.clEnqueueNDRangeKernel;
import static org.jocl.CL.clEnqueueReadBuffer;
import static org.jocl.CL.clGetDeviceIDs;
import static org.jocl.CL.clGetPlatformIDs;
import static org.jocl.CL.clReleaseCommandQueue;
import static org.jocl.CL.clReleaseContext;
import static org.jocl.CL.clReleaseKernel;
import static org.jocl.CL.clReleaseMemObject;
import static org.jocl.CL.clReleaseProgram;
import static org.jocl.CL.clSetKernelArg;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;

import org.jocl.CL;
import org.jocl.Pointer;
import org.jocl.Sizeof;
import org.jocl.cl_command_queue;
import org.jocl.cl_context;
import org.jocl.cl_context_properties;
import org.jocl.cl_device_id;
import org.jocl.cl_kernel;
import org.jocl.cl_mem;
import org.jocl.cl_platform_id;
import org.jocl.cl_program;

/**
 * A small JOCL sample.
 */
public class PackJocl
{
	cl_context context;				// 上下文
	cl_command_queue commandQueue;	// 命令队列
	cl_program program;				// 程序对象
	cl_kernel kernel;				// Kernel对象
	cl_mem memObjects[];			// 内存对象数组
	
    /**
     * 读取文件的内容
     * @param file 想要读取的文件对象
     * @return 返回文件内容
     */
    public static String readCl(File file){
        StringBuilder result = new StringBuilder();
        try{
            BufferedReader br = new BufferedReader(new FileReader(file));//构造一个BufferedReader类来读取文件
            String s = null;
            while((s = br.readLine())!=null){//使用readLine方法，一次读一行
                result.append(System.lineSeparator()+s);
            }
            br.close();    
        }catch(Exception e){
            e.printStackTrace();
        }
        return result.toString();
    }
    
    PackJocl(){
    	
    }
    
    /**
     * 加载平台和驱动
     * @param platformIdx 平台index
     * @param deviceIdx 驱动index
     */
    @SuppressWarnings("deprecation")
	public void init(int platformIdx, int deviceIdx){
    	final int platformIndex = platformIdx; // 选择哪个平台
        final long deviceType = CL_DEVICE_TYPE_GPU;
        final int deviceIndex = deviceIdx;

        // Enable exceptions and subsequently omit error checks in this sample
        CL.setExceptionsEnabled(true);

        // Obtain the number of platforms
        int numPlatformsArray[] = new int[1];
        clGetPlatformIDs(0, null, numPlatformsArray);
        int numPlatforms = numPlatformsArray[0];

        // Obtain a platform ID
        cl_platform_id platforms[] = new cl_platform_id[numPlatforms];
        clGetPlatformIDs(platforms.length, platforms, null);
        cl_platform_id platform = platforms[platformIndex];

        // Initialize the context properties
        cl_context_properties contextProperties = new cl_context_properties();
        contextProperties.addProperty(CL_CONTEXT_PLATFORM, platform);
        
        // Obtain the number of devices for the platform
        int numDevicesArray[] = new int[1];
        clGetDeviceIDs(platform, deviceType, 0, null, numDevicesArray);
        int numDevices = numDevicesArray[0];
        
        // Obtain a device ID 
        cl_device_id devices[] = new cl_device_id[numDevices];
        clGetDeviceIDs(platform, deviceType, numDevices, devices, null);
        cl_device_id device = devices[deviceIndex];
        context = clCreateContext(
        contextProperties, 1, new cl_device_id[]{device}, 
        null, null, null);
    
        // Create a command-queue for the selected device
        commandQueue = clCreateCommandQueue(context, device, 0, null);
    }
    
    /**
     * 创建Kernel
     * @param clName Kernel文件名
     * @param funcName Kernel函数名
     */
    public void createKernel(String clName, String funcName){
    	program = clCreateProgramWithSource(context, 1, new String[]{  readCl(new File(clName)) }, null, null);
        
        // Build the program
        clBuildProgram(program, 0, null, null, null, null);
            
        // Create the kernel
        kernel = clCreateKernel(program, funcName, null);
    }
    
    /**
     * 创建Kernel
     * @param p 包含所有参数的指针数组
     * @param n 分配内存空间大小 
     */
    public void setParameters(Pointer[] p, int n){
    	memObjects = new cl_mem[p.length];
    	for(int i = 0; i < p.length; i++){
    		memObjects[i] = clCreateBuffer(context, CL_MEM_READ_ONLY | CL_MEM_COPY_HOST_PTR, Sizeof.cl_float * n, p[i], null);
    	}
    	
    	for(int i = 0; i < p.length; i++){
    		clSetKernelArg(kernel, i, Sizeof.cl_mem, Pointer.to(memObjects[i]));
    	}
    	
    }
    
    /**
     * 执行Kernel
     * @param dim 维数
     * @param global_work_size[] global_work_size
     * @param local_work_size[] local_work_size
     */
    public void execute(int dim, long global_work_size[], long local_work_size[]){
         // Execute the kernel
         clEnqueueNDRangeKernel(commandQueue, kernel, dim, null,global_work_size, local_work_size, 0, null, null);
    }

    /**
     * 把显存里的计算结果取回内存
     * @param index 参数位置
     * @param dstPointer 结果指针
     * @param size 分配内存空间大小 
     */
    public void getData(int index, Pointer dstPointer, int size){
    	 clEnqueueReadBuffer(commandQueue, memObjects[index], CL_TRUE, 0, size * Sizeof.cl_float, dstPointer, 0, null, null);
    }
    
    public void clear(){
    	 clReleaseMemObject(memObjects[0]);
         clReleaseMemObject(memObjects[1]);
         clReleaseMemObject(memObjects[2]);
         clReleaseKernel(kernel);
         clReleaseProgram(program);
         clReleaseCommandQueue(commandQueue);
         clReleaseContext(context);
    }
  
}
```
PackageTest.java
``` java
package jocl;

import org.jocl.Pointer;

public class PackageTest {
	public static void main(String args[]){
		PackJocl  jocl= new PackJocl();
		
		// 初始化，第一个参数是平台index，第二个参数是驱动index
		jocl.init(1,0);
		
		// 创建内核， 第一个是内核文件名，第二个是内核函数名
		jocl.createKernel("E://kernel.cl", "add");
		
		// 获取测试数据并复制到显存
		int n = 10;
        float srcArrayA[] = new float[n];
        float srcArrayB[] = new float[n];
        float dstArray[] = new float[n];
        for (int i=0; i<n; i++)
        {
            srcArrayA[i] = i;
            srcArrayB[i] = i;
        }
        Pointer parameters[] = {
        		Pointer.to(srcArrayA),
        		Pointer.to(srcArrayB),
        		Pointer.to(dstArray)};
        
		jocl.setParameters(parameters, n);
		
		// 执行
		jocl.execute(1,new long[]{n}, new long[]{1});
		
		// 获取执行结果
		jocl.getData(2, Pointer.to(dstArray), n);
		
		// clear
		jocl.clear();
		
		System.out.println(dstArray[9]);
		
		
	}
}

```
kernel.cl 我是放在E盘根目录下，所以PackageTest.java中写的jocl.createKernel("E://kernel.cl", "add"); 你可以改成其他的
``` c
__kernel void add(__global const float *a, __global const float *b, __global float *c)
{
	int gid = get_global_id(0);
	printf("%d\t",gid);
	c[gid] = a[gid] + b[gid];
}
```
运行结果
![blog1.PNG](https://ifthat.com/file/blog1.PNG)
第一次写文章，希望可以帮助到你
