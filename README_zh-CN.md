# Tiny

## 介绍

* [English](https://github.com/jnxey/tiny/)

* Tiny是一个简单的、基于`Node+Typescript`的服务端框架，它的核心代码很小，提供了许多有意思的类以及装饰器，可以帮助你节约配置路由、校验参数、设置`Jwt`、编写`API`文档的时间，以及其他额外的功能。

* Tiny的诞生源于在Node开发过程中容易出现异步代码混乱问题，和其他框架不同，它对异步中间件的使用进行了限制，通常建议只在控制器的方法上使用`@Middleware`装饰器进行设置，它的优点是不会让异步代码太过于混乱，缺点是不够灵活。

* 通常建议只在涉及到`@Middleware`，`@Jwt`，`tiny.run`的执行时使用异步，Tiny内置了对应的错误处理，若在其他地方使用异步，其错误需自行处理。

## 环境

![NODE Version][node-image]
![NPM Version][npm-image]

[node-image]: https://camo.githubusercontent.com/4cef9791aaa5dd6100e2361cd25eeef3beb77b0d879702349fa4ac78211bcb7e/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6e6f64652d25323025334525334425323031382d343763323139
[npm-image]: https://camo.githubusercontent.com/b133c2aa426b98acd72f5aa52d309ba036a825616acf8994f1f2e115dbffe965/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f6d7174742e7376673f6c6f676f3d6e706d

## 目录

- [介绍](#介绍)
- [环境](#环境)
- [目录](#目录)
- [安装](#安装)
- [使用](#使用)
- [API描述](#API描述)
  - [CreateApp](#CreateApp)
  - [Context](#Context)
  - [Controller](#Controller)
    - [Controller](#Controller)
    - [Get](#Get)
    - [Delete](#Delete)
    - [Post](#Post)
    - [Put](#Put)
    - [Patch](#Patch)
    - [Type](#Type)
    - [Middleware](#Middleware)
    - [Mapping](#Mapping)
    - [Summary](#Summary)
  - [Router](#Router)
  - [Model](#Model)
    - [Model](#Model)
    - [Declare](#Declare)
    - [Required](#Required)
    - [TypeCheck](#TypeCheck)
    - [ArrayCheck](#ArrayCheck)
    - [StringLength](#StringLength)
    - [TypeCustom](#TypeCustom)
  - [Params](#Params)
  - [Jwt](#Jwt)
    - [Jwt](#Jwt)
    - [Protected](#Protected)
  - [Dto](#Dto)
    - [Dto](#Dto)
  - [Values](#Values)
    - [MethodType](#MethodType)
    - [DataType](#DataType)
    - [ParamsSource](#ParamsSource)
    - [ParamsType](#ParamsType)
    - [StatusCode](#StatusCode)
- [其他](#其他)

## 安装

* 安装之前，请下载并安装 Node.js。需要 Node.js V18.0.0 或更高版本。

### 创建一个Tiny应用

* 创建基于Tiny的项目可以使用Tiny提供的项目模版，该模版设置了简单的项目结构，可供您参考。

```shell
npm create node-tiny <project-name>
```

### 在已有项目中安装Tiny

```shell
npm install --save node-tiny
```

### 查看当前API信息
* 若是使用Tiny模版构建的项目，可以访问`/doc.html`地址查看最简单的API信息

## 使用

### 初次使用示例

* 文件`index.ts`
```typescript
import Tiny from 'node-tiny';
import { Manager } from '@/controller/manager';

const { CreateApp, Router } = Tiny;

const tiny = new CreateApp();
const router = new Router();

router.config({ prefix: '/api' });
router.register(new Manager());

tiny.listen(4000);
```
* 文件`@/controller/manager.ts`
```typescript
import Tiny from 'node-tiny';
const { Controller, Summary, Dto, StatusCode, Get } = Tiny;

export class Manager extends Controller {
  @Get()
  @Summary('This is a summary')
  public async index(context) {
    context.send(StatusCode.success, new Dto({ code: StatusCode.success, result: 'hello word', msg: 'success' }));
  }
}
```

## API描述

## CreateApp

* 使用`Tiny.CreateApp`可以创建一个Tiny应用
```typescript
const tiny = new CreateApp();
```
* 使用`tiny.run`可以设置程序运行内容，接收一个请求上下文[Context](#Context)参数，通常在`tiny.listen`之前进行配置
```typescript
tiny.run = async (context) => {
  router.work(context);
}
```

* 使用`tiny.error`监听程序执行过程报错，使用`context.error`可以触发`tiny.error`的执行
```typescript
tiny.error = (err) => {
  // ToDo
}
```
* 使用`tiny.errorCode`以及`tiny.errorMsg`配置报错的回文信息，默认为`500`以及`Internal Server Error`
```typescript
tiny.errorCode = 500
tiny.errorMsg = 'Internal Server Error'
```

## Context

* `Context`保存了整个请求的上下文信息，以及自定义的其他信息，以下是在`tiny.listen`内部的调用过程
```typescript
  function listen(...args): Server {
    const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
      try {
        const context = new Context(req, res);
        this.run(context);
      } catch (e: FunctionError) {
        // ...
      }
    });
    return server.listen(...args);
  }
```

* `context.req:IncomingMessage`，请求信息

* `context.res:ServerResponse`，回文信息

* `context.query:ContextQuery`，请求 查询参数 以及 路径参数 ，也意味着两种参数不能重名，在`router.work`内部已经实现，直接使用即可
```typescript
type ContextQuery = object | null | undefined;
```

* `context.body:ContextBody`，保存在body内的参数，Tiny内部未内置body解析，可在`tiny.run`方法中使用第三方库进行解析
```typescript
type ContextBody = object | string | null | undefined;
```

* `context.params:ContextParams`，通过`@Tiny.Param.in`校验后的参数，会自动填入，可直接使用
```typescript
type ContextParams = object | null | undefined;
```

* `context.payload:ContextPayload`，通过`Tiny.Jwt`校验后的信息，在使用`@Protected`装饰器后，会自动填入，可直接使用
```typescript
type ContextPayload = object | string | null | undefined;
```

* `context.payload:ContextFiles`，可扩充的文件信息，`Tiny`内部未进行设置，在使用`@Protected`装饰器后，会自动填入，可直接使用
```typescript
type ContextFiles = any[] | null | undefined;
```

* `context.extend:ContextExtend`，可扩充的其他信息
```typescript
type ContextExtend = object;
```

* `context.cookie:CookieManager`，cookie管理工具，可直接使用
```typescript
interface CookieManager {
  // 通过名称获取cookie
  get(name: string): string | undefined;
  // 设置一个cookie
  set(name: string, value: string, options: CookieOptions = {}): void;
  // 删除一个cookie
  delete(name: string, options: CookieOptions = {}): void
}
```

* `context.error:Function`，可将执行过程的错误抛至`tiny.error`进行处理

* `context.send<T = Dto>(code: number, data: T, type?: DataType)`，发送请求信息
```typescript
context.send(StatusCode.success, new Dto({ code: StatusCode.success, result: 'hello word', msg: 'success' }));
```

* `context.setQuery(query: ContextQuery)`，设置地址参数信息，在router.work内部已经实现，直接使用即可

* `context.setBody(body: ContextBody)`，设置body参数信息，Tiny内部未内置body解析，在tiny.run方法中使用第三方库进行解析
```typescript
tiny.run = async (context) => {
  await bodyHandler(context); // 第三方body解析库
  router.work(context);
};
```

* `context.setParams(params: ContextParams)`，设置校验参数信息，在使用Params.in装饰器后，会自动填入，可直接使用
```typescript
class Manager extends Controller {
  @Post()
  @Type()
  @Params.in(HomeIndexInput, ParamsSource.body)
  getParams(context) {
    context.send(StatusCode.success, new Dto({ code: StatusCode.success, result: context.params, msg: 'success' }));
  }
}
```

* `context.setPayload(payload: ContextPayload)`，设置Jwt校验信息，在使用`@Protected`装饰器后，会自动填入，可直接使用

```typescript
class Manager extends Controller {
  @Post()
  @Type()
  @Protected()
  jwtVerify(context) {
    context.send(StatusCode.success, new Dto({code: StatusCode.success, result: context.payload, msg: 'success'}));
  }
}
```

* `context.setFiles(files: ContextFiles)`，设置文件信息

* `context.setExtend<T>(name: string, value: T)`，设置扩展信息

### Controller

#### Controller
* 所有控制器都应该继承`Controller`类
```typescript
import Tiny from 'node-tiny';
const { Controller, Summary, Dto, StatusCode, Get } = Tiny;

export class Manager extends Controller {
  @Get()
  @Summary('This is a summary')
  public async index(context) {
    context.send(StatusCode.success, new Dto({ code: StatusCode.success, result: 'hello word', msg: 'success' }));
  }
}
```

#### Get

* 使用`@Get()`装饰器，声明一个Get方法
```typescript
import Tiny from 'node-tiny';
export class Manager extends Controller {
  @Tiny.Get()
  public async index(context) {
    // ...
  }
}
```

#### Delete

* 使用`@Delete()`装饰器，声明一个Delete方法
```typescript
import Tiny from 'node-tiny';
export class Manager extends Controller {
  @Tiny.Delete()
  public async index(context) {
    // ...
  }
}
```

#### Post

* 使用`@Post()`装饰器，声明一个Post方法
```typescript
import Tiny from 'node-tiny';
export class Manager extends Controller {
  @Tiny.Post()
  public async index(context) {
    // ...
  }
}
```

#### Put

* 使用`@Put()`装饰器，声明一个Put方法
```typescript
import Tiny from 'node-tiny';
export class Manager extends Controller {
  @Tiny.Put()
  public async index(context) {
    // ...
  }
}
```

#### Patch

* 使用`@Patch()`装饰器，声明一个Patch方法
```typescript
import Tiny from 'node-tiny';
export class Manager extends Controller {
  @Tiny.Patch()
  public async index(context) {
    // ...
  }
}
```

#### Type

* 使用`@Type(requestType?: DataType, responseType?: DataType)`声明请求/响应内容类型，默认为`DataType.json`类型

```typescript
import Tiny from 'node-tiny';

export class Manager extends Controller {
  @Tiny.Patch()
  @Tiny.Type(DataType.formData, DataType.formData)
  public async index(context) {
    // ...
  }
}
```

#### Middleware

* 使用`@Middleware(handler: ContextAsyncHandler)`，为控制器设置中间件
```typescript
import Tiny from 'node-tiny';
function execMiddleware(context, next) {
  if(context.extend.a) {
    context.send(StatusCode.success, new Dto({ code: StatusCode.success, result: 'middleware', msg: 'success' }));
  } else {
    next();
  }
}

export class Manager extends Controller {
  @Tiny.Patch()
  @Tiny.Middleware(execMiddleware)
  public async index(context) {
    // ...
  }
}
```

#### Mapping

* 使用`@Mapping(path: string)`装饰器，重置路由地址
```typescript
import Tiny from 'node-tiny';
export class Manager extends Controller {
  @Tiny.Patch()
  @Mapping('/manager/test/:id')
  public async index(context) {
    // ...
  }
}
```

#### Summary

* 使用`@Summary(summary?: string, describe?: string)`装饰器，给方法设置说明文档
```typescript
import Tiny from 'node-tiny';
export class Manager extends Controller {
  @Tiny.Patch()
  @Summary('测试方法')
  public async index(context) {
    // ...
  }
}
```

## Router

* 使用`Router`创建路由实例

```typescript
const router = new Router()
```

* `router.options:ConnectOptions`是路由配置项
```typescript
type ConnectOptions = {
  prefix?: string;
  format?: boolean;
};
```

* `router.apiJSON:RouterApiJson[]`是api配置JSON信息，可以借此生成API文档
```typescript
type RouterApiJson = {
  module: string;
  describe?: string;
  func: string;
  path: string;
  method: string;
  requestType?: string;
  responseType?: string;
  summary?: string;
  paramsModel?: object;
  resultModel?: object;
};
```

* `router.routes:RoutesList`是已配置的路由列表
```typescript
type RouteItem = { path: string; method: MethodType; handler: Function };
type RouteValue = {
  REG: RouteItem[];
  [path: string]: RouteItem | RouteItem[];
};
type RoutesList = {
  GET: RouteValue;
  POST: RouteValue;
  PUT: RouteValue;
  PATCH: RouteValue;
  DELETE: RouteValue;
};
```

* `router.config(options: ConnectOptions)`设置路由配置项

* `router.notFound(context: ContextBase)`未找到路由，触发404报错

* `router.work(context: ContextBase)`路由开始执行

* `router.register(controller: Controller)`注册路由
```typescript
router.register(new Manager());
```

## Model

#### Model

* 使用`model<Model>.fill(map: object)`填充数据模型
```typescript
class LoginInput extends Model {
  @Declare()
  name!: string;

  @Declare()
  password!: string;
}

const input = new LoginInput();
const result: ModelResult = input.fill({...});
if(result.valid) {
  // ...
}
```

* 使用`model<Model>.getConfigCache`获取当前模型配置
```typescript
new LoginInput().getConfigCache();
```

##### ModelResult

* 使用`new ModelResult(valid: boolean, message?: string, value?: any)`设置模型校验结果

#### Declare

* 使用`@Declare(description?: string)`装饰器，声明参数，注意：模型参数至少需要使用`Declare`
```typescript
class LoginInput extends Model {
  @Declare()
  name!: string;
}
```

#### Required

* 使用`@Required(message?: string)`装饰器，设置属性必须
```typescript
class LoginInput extends Model {
  @Declare()
  @Required('名称不能唯空')
  name!: string;
}
```

#### TypeCheck

* 使用`@TypeCheck(type: ParamsType | T, message?: string)`装饰器，设置类型检查
```typescript
class LoginInput extends Model {
  @Declare()
  @TypeCheck(ParamsType.string, '名称只能为字符串')
  name!: string;
}
```

#### ArrayCheck

* 使用`@ArrayCheck(type: ParamsType | T, message?: string, maxLength?: number, maxLengthMessage?: string)`装饰器，设置数组类型检查，前置条件为`TypeCheck`设置`ParamsType.array`
```typescript
class LoginInput extends Model {
  @Declare()
  @TypeCheck(ParamsType.array, '列表只能为数组')
  @ArrayCheck(ParamsType.string, '数组内容只能为字符串')
  list!: string[];
}
```

#### StringLength

* 使用`@StringLength(range: number[], message?: string)`装饰器，设置字符串长度校验，前置条件为`TypeCheck`设置`ParamsType.string`
```typescript
class LoginInput extends Model {
  @Declare()
  @TypeCheck(ParamsType.string, '名称只能为字符串')
  @StringLength([1,50], '名称长度只能为1-50')
  name!: string;
}
```

#### TypeCustom

* 使用`@TypeCustom<T>(valid: (value: T) => ModelResult)`装饰器，设置自定义校验内容，返回一个`ModelResult`
```typescript
class LoginInput extends Model {
  @Declare()
  @TypeCustom((value) => {
    if(value) {
      // ...
    }
    return new Tiny.ModelResult(true,'', value);
  })
  name!: string;
}
```

### Params

#### Params

* 使用`@Params.in<T extends Model>(params: { new (): T }, type: ParamsSource, validate: boolean = true)`装饰器，设置入参校验
```typescript
import Tiny from 'node-tiny';
const { Controller, Post, Params } = Tiny;

class LoginInput extends Model {
  @Declare()
  name!: string;

  @Declare()
  password!: string;
}

export class Manager extends Controller {
  @Post()
  @Params.in(LoginInput, ParamsSource.body)
  public async index(context) {
    console.log(context.params.name)
    console.log(context.params.password)
    // ...
  }
}
```
* 使用`@Params.out<T extends Model>(result: { new (): T })`装饰器，设置出参类型
```typescript
import Tiny from 'node-tiny';
const { Controller, Post, Params, Dto, StatusCode } = Tiny;

class LoginOut extends Model {
  @Declare()
  id!: string;

  @Declare()
  name!: string;
}

export class Manager extends Controller {
  @Post()
  @Params.out(LoginOut)
  public async index(context) {
    // ...
    const info = new LoginOut();
    info.fill({...});
    // ...
  }
}
```

### Jwt

#### Jwt

* 配置`Jwt.sign = <Payload = object>(context: ContextBase, payload: Payload) => string | null | undefined;`生成token
```typescript
Jwt.sign = (context, payload) => {
  context.cookie.set('token', JSON.stringify(payload));
  return JSON.stringify(payload);
};
```
* 配置`Jwt.verify = (context: ContextBase, next: () => any) => any;`验证token
```typescript
Jwt.verify = (context, next) => {
  const token = context.cookie.get('token');
  if (token) {
    context.setPayload(getJSON(token));
    next();
  } else {
    Jwt.refuse(context);
  }
}
```
* 配置`Jwt.refuse = (context: ContextBase) => any;`处理校验失败，默认是如下处理
```typescript
Jwt.refuse = (context, next) => {
  context.send(StatusCode.success, new Dto({ code: StatusCode.authError, msg: 'No permission to access temporarily', result: null }));
}
```

#### Protected

* 使用`@Protected()`装饰器，配置后的方法将进行`Jwt`验证
```typescript
import Tiny  from 'node-tiny';
const { Controller, Post, Protected } = Tiny;

export class Manager extends Controller {
  @Post()
  @Protected()
  public async index(context) {
    console.log(context.payload)
    // ...
  }
}
```

### Dto

#### Dto

* 使用`new Dto({ code: number | string, result?: any, msg?: string })`设置Response返回码

### Values

#### MethodType

* 请求类型
```typescript
export enum MethodType {
  head = 'HEAD',
  options = 'OPTIONS',
  get = 'GET',
  delete = 'DELETE',
  post = 'POST',
  put = 'PUT',
  patch = 'PATCH'
}
```

#### DataType

* body的数据结构类型
```typescript
export enum DataType {
  json = 'application/json',
  text = 'text/plain',
  html = 'text/html',
  xml = 'text/xml',
  formUrlencoded = 'application/x-www-form-urlencoded',
  formData = 'multipart/form-data',
  other = 'other'
}
```

#### ParamsSource

* 参数来源
```typescript
export enum ParamsSource {
  query = 'query',
  body = 'body'
}
```

#### ParamsType

* 参数数据类型
```typescript
export enum ParamsType {
  number = 'number',
  boolean = 'boolean',
  string = 'string',
  array = 'array'
}
```

#### StatusCode

* Response状态值
```typescript
export const StatusCode = {
  success: 200,
  paramsError: 400,
  authError: 401,
  notFound: 404,
  timeout: 408,
  serveError: 500
};
```

## 其他


