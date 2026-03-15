#!/usr/bin/env python3
"""
图标转换脚本 - 将spark-store.svg转换为标准尺寸的PNG图标
支持尺寸: 64x64, 128x128, 256x256, 512x512
"""

import os
import sys
from PIL import Image
import cairosvg

def convert_svg_to_png(svg_path, output_dir, sizes=[64, 128, 256, 512]):
    """
    将SVG文件转换为多种尺寸的PNG图标
    
    Args:
        svg_path: SVG文件路径
        output_dir: 输出目录
        sizes: 需要生成的尺寸列表
    """
    
    # 检查输入文件是否存在
    if not os.path.exists(svg_path):
        print(f"错误: 找不到SVG文件 {svg_path}")
        return False
    
    # 创建输出目录（如果不存在）
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"创建输出目录: {output_dir}")
    
    # 获取文件名（不含扩展名）
    base_name = os.path.splitext(os.path.basename(svg_path))[0]
    
    # 读取SVG文件
    with open(svg_path, 'rb') as svg_file:
        svg_data = svg_file.read()
    
    # 为每个尺寸生成PNG
    for size in sizes:
        output_filename = f"{base_name}_{size}x{size}.png"
        output_path = os.path.join(output_dir, output_filename)
        
        try:
            # 使用cairosvg将SVG转换为PNG
            cairosvg.svg2png(
                bytestring=svg_data,
                write_to=output_path,
                output_width=size,
                output_height=size
            )
            print(f"✓ 已生成: {output_filename} ({size}x{size})")
            
            # 验证生成的PNG文件
            with Image.open(output_path) as img:
                actual_size = img.size
                if actual_size == (size, size):
                    print(f"  - 尺寸验证通过: {actual_size}")
                else:
                    print(f"  - 警告: 实际尺寸为 {actual_size}")
                    
        except Exception as e:
            print(f"✗ 生成 {size}x{size} 时出错: {str(e)}")
            return False
    
    return True

def generate_hicolor_icons(svg_path, base_output_dir):
    """
    生成符合hicolor主题标准的图标目录结构
    
    Args:
        svg_path: SVG文件路径
        base_output_dir: 基础输出目录
    """
    
    # 定义标准尺寸和对应的子目录
    icon_sizes = {
        64: "64x64/apps",
        128: "128x128/apps",
        256: "256x256/apps",
        512: "512x512/apps"
    }
    
    # 获取文件名（不含扩展名）
    base_name = os.path.splitext(os.path.basename(svg_path))[0]
    
    # 为每个尺寸创建目录并生成图标
    for size, subdir in icon_sizes.items():
        output_dir = os.path.join(base_output_dir, subdir)
        
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        
        output_path = os.path.join(output_dir, f"{base_name}.png")
        
        try:
            # 读取SVG并转换
            with open(svg_path, 'rb') as svg_file:
                svg_data = svg_file.read()
            
            cairosvg.svg2png(
                bytestring=svg_data,
                write_to=output_path,
                output_width=size,
                output_height=size
            )
            print(f"✓ 已生成: {output_dir}/{base_name}.png ({size}x{size})")
            
        except Exception as e:
            print(f"✗ 生成 {size}x{size} 时出错: {str(e)}")
            return False
    
    return True

def main():
    """
    主函数
    """
    # 默认配置
    svg_file = "spark-store.svg"
    output_dir = "spark-store-icons"
    hicolor_dir = "hicolor"
    
    print("=" * 50)
    print("Spark Store 图标转换工具")
    print("=" * 50)
    
    # 检查是否安装了必要的库
    try:
        import PIL
        import cairosvg
    except ImportError as e:
        print("错误: 缺少必要的Python库")
        print("请安装依赖:")
        print("  pip install Pillow cairosvg")
        return
    
    # 检查SVG文件
    if not os.path.exists(svg_file):
        print(f"错误: 在当前目录找不到 {svg_file}")
        print(f"请确保 {svg_file} 文件存在于当前目录")
        return
    
    print(f"\n输入文件: {svg_file}")
    
    # 生成普通PNG图标
    print("\n[1/2] 生成标准尺寸PNG图标...")
    if convert_svg_to_png(svg_file, output_dir):
        print(f"✓ 所有PNG图标已生成到: {output_dir}/")
    else:
        print("✗ 生成PNG图标失败")
        return
    
    # 生成hicolor格式图标
    print("\n[2/2] 生成hicolor格式图标...")
    if generate_hicolor_icons(svg_file, hicolor_dir):
        print(f"✓ hicolor图标已生成到: {hicolor_dir}/")
    else:
        print("✗ 生成hicolor图标失败")
        return
    
    print("\n" + "=" * 50)
    print("✓ 图标转换完成！")
    print("=" * 50)
    print("\n生成的文件：")
    print(f"1. 普通PNG图标: {output_dir}/")
    print(f"   - spark-store_64x64.png")
    print(f"   - spark-store_128x128.png")
    print(f"   - spark-store_256x256.png")
    print(f"   - spark-store_512x512.png")
    print(f"\n2. hicolor格式图标: {hicolor_dir}/")
    print(f"   - {hicolor_dir}/64x64/apps/spark-store.png")
    print(f"   - {hicolor_dir}/128x128/apps/spark-store.png")
    print(f"   - {hicolor_dir}/256x256/apps/spark-store.png")
    print(f"   - {hicolor_dir}/512x512/apps/spark-store.png")

if __name__ == "__main__":
    main()
