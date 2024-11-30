# Tiny

## 介绍

Tiny是一个简单的、基于Node+Typescript+Koa2/生态的服务端工具库，它的核心代码只有不到20K，它提供了许多有意思的类以及装饰器，可以帮助你节约配置路由、校验参数、设置登录状态、编写API文档的时间，以及其他额外的功能。

Tiny旨在提供一个简单的工具库给开发者使用，不涉及部署、运维相关内容。

## 环境

![NODE Version][node-image]
![NPM Version][npm-image]

[node-image]: https://camo.githubusercontent.com/48b3dcbb1bdec68f5587b58f71e7165fd5b624e01c8ba350369873da6e32cb56/68747470733a2f2f696d672e736869656c64732e696f2f6e6f64652f762f6d7174742e737667
[npm-image]: https://camo.githubusercontent.com/b133c2aa426b98acd72f5aa52d309ba036a825616acf8994f1f2e115dbffe965/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f6d7174742e7376673f6c6f676f3d6e706d

## 目录

- [介绍](#介绍)
- [环境](#环境)
- [目录](#目录)
- [安装](#安装)
- [使用](#使用)
- [API描述](#API描述)
  - [Controller](#Controller)
    - [Controller](#Controller)
    - [Get](#Get)
    - [Delete](#Delete)
    - [Post](#Post)
    - [Put](#Put)
    - [View](#View)
    - [Json](#Json)
    - [Text](#Text)
    - [FormUrlencoded](#FormUrlencoded)
    - [FormData](#FormData)
    - [Other](#Other)
    - [Prefix](#Prefix)
    - [Mapping](#Mapping)
    - [Summary](#Summary)
  - [Model](#Model)
    - [Model](#Model)
    - [ModelResult](#ModelResult)
    - [Declare](#Declare)
    - [Required](#Required)
    - [TypeCheck](#TypeCheck)
    - [ArrayCheck](#ArrayCheck)
    - [StringLength](#StringLength)
  - [Params](#Params)
    - [Params](#Result)
    - [Result](#Result)
  - [Jwt](#Jwt)
    - [Jwt](#Jwt)
    - [Protected](#Protected)
  - [Dto](#Dto)
    - [Dto](#Dto)
    - [DtoCtxExtend](#DtoCtxExtend)
  - [Values](#Values)
    - [MethodType](#MethodType)
    - [DataType](#DataType)
    - [ParamsSource](#ParamsSource)
    - [ParamsType](#ParamsType)
    - [ModelConfigCache](#ModelConfigCache)
    - [StatusCode](#StatusCode)
- [其他](#其他)

## 安装

