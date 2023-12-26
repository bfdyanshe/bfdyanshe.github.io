# -*- coding: utf-8 -*-

import sys
import os
import re
from urllib import parse
import shutil

MdAttachmentPattern = re.compile(r"(!\[.*?\]\((.*?)\))")


def get_attachment_list(file: str):
    filepath = os.path.dirname(filename)
    attachment_list = list()
    with open(file, encoding="utf-8") as MdFile:
        for line in MdFile.readlines():
            mdAttachmentResult = re.findall(MdAttachmentPattern, line)
            if mdAttachmentResult is None:
                continue
            for match_group in mdAttachmentResult:
                attachment_filename = parse.unquote(match_group[1])
                attachment_list.append(os.path.join(filepath, attachment_filename))
    return attachment_list


def source_replace_attachment_path(file: str, destination: str):
    """把 markdown 中的附件路径替换成 hexo 的附件路径
    """    
    with open(file, encoding="utf-8") as MdFile:
        source_lines = MdFile.readlines()
        source_lines = list(
            map(
                lambda line: line.replace(r"(_attachments/", f"({destination}/"),
                source_lines,
            )
        )
        return source_lines


def copy_attachments(attachment_list, dest_attachment_path):
    for att in attachment_list:
        shutil.copyfile(att, os.path.join(dest_attachment_path, os.path.basename(att)))


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(f"{sys.argv[0]} SOURCE DESTINATION")
        exit(0)
    filename = sys.argv[1]
    destination = sys.argv[2]
    if os.access("_config.yml", mode=os.F_OK) is False:
        print("需要在 hexo 路径下执行")
        exit(0)
    post_path = r"source\_posts"
    target_attachment_path = os.path.join(post_path, destination)
    os.mkdir(target_attachment_path)
    if os.access(target_attachment_path, mode=os.F_OK):
        print(f"{destination} 文件已存在")
        exit(0)

    # 复制 markdown
    target_post_md_filename = os.path.join(post_path, destination + ".md")
    copy_data = source_replace_attachment_path(filename, destination)

    # 复制附件
    with open(target_post_md_filename, mode="w", encoding="utf-8") as dest:
        dest.writelines(copy_data)
    attachment_list = get_attachment_list(filename)
    copy_attachments(attachment_list, target_attachment_path)