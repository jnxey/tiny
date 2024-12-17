# Tiny

## Introduce

* [简体中文](https://github.com/jnxey/tiny/blob/main/README_zh-CN.md)

* Tiny is a simple server-side framework based on `Node+Typescript`. Its core code is very small and provides many interesting classes and decorators to help you save time configuring routes, validating parameters, setting up `Jwt`, writing `API` documentation, and other additional features.

* Tiny was born out of the problem of asynchronous code confusion that is prone to occur during Node development. Unlike other frameworks, it restricts the use of asynchronous middleware. It is usually recommended to only use the `@Middleware` decorator on the controller method for setting. Its advantage is that it will not make the asynchronous code too confusing, but its disadvantage is that it is not flexible enough.

* It is usually recommended to use async only when it comes to `@Middleware`, `@Jwt`, and `tiny.run` execution. Tiny has built-in corresponding error handling. If async is used elsewhere, the errors need to be handled by yourself.

## Environment

![NODE Version][node-image]
![NPM Version][npm-image]

[node-image]: https://camo.githubusercontent.com/4cef9791aaa5dd6100e2361cd25eeef3beb77b0d879702349fa4ac78211bcb7e/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6e6f64652d25323025334525334425323031382d343763323139
[npm-image]: https://camo.githubusercontent.com/b133c2aa426b98acd72f5aa52d309ba036a825616acf8994f1f2e115dbffe965/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f6d7174742e7376673f6c6f676f3d6e706d

## Directory

- [Introduce](#Introduce)
- [Environment](#Environment)
- [Directory](#Directory)
- [Install](#Install)
- [Use](#Use)
- [API Description](#API-Description)
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
- [Other](#Other)

## Install

* Before installing, download and install Node.js. Node.js V18.0.0 or later is required.

### Creating a Tiny Application

* To create a Tiny-based project, you can use the project template provided by Tiny. This template sets up a simple project structure for your reference.

```shell
npm create node-tiny <project-name>
```

### Installing Tiny in an existing project

```shell
npm install --save node-tiny
```

### View current API information
* If you use the Tiny template to build your project, you can visit the `/doc.html` address to view the simplest API information.

## Use

### First-time usage example

* File `index.ts`
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
* File `@/controller/manager.ts`
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

## API Description

## CreateApp

* Use `Tiny.CreateApp` to create a Tiny application
```typescript
const tiny = new CreateApp();
```
* Use `tiny.run` to set the program running content, receiving a request context [Context](#Context) parameter, which is usually configured before `tiny.listen`
```typescript
tiny.run = async (context) => {
  router.work(context);
}
```

* Use `tiny.error` to monitor program execution errors, use `context.error` to trigger the execution of `tiny.error`
```typescript
tiny.error = (err) => {
  // ToDo
}
```
* Use `tiny.errorCode` and `tiny.errorMsg` to configure the error message, the default is `500` and `Internal Server Error`
```typescript
tiny.errorCode = 500
tiny.errorMsg = 'Internal Server Error'
```

## Context

* `Context` stores the context information of the entire request, as well as other customized information. The following is the calling process inside `tiny.listen`
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

* `context.req:IncomingMessage`, Request information

* `context.res:ServerResponse`, Response information

* `context.query:ContextQuery`, Request query parameters and path parameters, which also means that the two parameters cannot have the same name. This has been implemented in `router.work` and can be used directly
```typescript
type ContextQuery = object | null | undefined;
```

* `context.body:ContextBody`, the parameters saved in the body, Tiny does not have a built-in body parsing, you can use a third-party library to parse it in the `tiny.run` method
```typescript
type ContextBody = object | string | null | undefined;
```

* `context.params:ContextParams`, the parameters verified by `@Tiny.Param.in` will be automatically filled in and can be used directly
```typescript
type ContextParams = object | null | undefined;
```

* `context.payload:ContextPayload`, the information verified by `Tiny.Jwt` will be automatically filled in after using the `@Protected` decorator and can be used directly
```typescript
type ContextPayload = object | string | null | undefined;
```

* `context.payload:ContextFiles`, expandable file information, not set inside `Tiny`, after using the `@Protected` decorator, it will be automatically filled in and can be used directly
```typescript
type ContextFiles = any[] | null | undefined;
```

* `context.extend:ContextExtend`, other information that can be expanded
```typescript
type ContextExtend = object;
```

* `context.cookie:CookieManager`, cookie management tool, can be used directly
```typescript
interface CookieManager {
  // Get a cookie by name
  get(name: string): string | undefined;
  // Setting a cookie
  set(name: string, value: string, options: CookieOptions = {}): void;
  // Deleting a cookie
  delete(name: string, options: CookieOptions = {}): void
}
```

* `context.error:Function`, Errors during execution can be thrown to `tiny.error` for processing

* `context.send<T = Dto>(code: number, data: T, type?: DataType)`, send request information
```typescript
context.send(StatusCode.success, new Dto({ code: StatusCode.success, result: 'hello word', msg: 'success' }));
```

* `context.setQuery(query: ContextQuery)`, set the address parameter information, which has been implemented in router.work and can be used directly

* `context.setBody(body: ContextBody)`, set body parameter information, Tiny does not have built-in body parsing, use a third-party library for parsing in the tiny.run method
```typescript
tiny.run = async (context) => {
  await bodyHandler(context); // Third-party body parsing library
  router.work(context);
};
```

* `context.setParams(params: ContextParams)`, set the validation parameter information, after using the `Params.in` decorator, it will be automatically filled in and can be used directly
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

* `context.setPayload(payload: ContextPayload)`, set the Jwt verification information, after using the `@Protected` decorator, it will be automatically filled in and can be used directly

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

* `context.setFiles(files: ContextFiles)`, set file information

* `context.setExtend<T>(name: string, value: T)`, set extended information

### Controller

#### Controller
* All controllers should inherit from the `Controller` class
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

* Use the `@Get()` decorator to declare a Get method
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

* Use the `@Delete()` decorator to declare a Delete method
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

* Use the `@Post()` decorator to declare a Post method
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

* Use the `@Put()` decorator to declare a Put method
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

* Use the `@Patch()` decorator to declare a Patch method
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

* Use `@Type(requestType?: DataType, responseType?: DataType)` to declare the request/response content type, which defaults to the `DataType.json` type

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

* Use `@Middleware(handler: ContextAsyncHandler)` to set middleware for the controller
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

* Use the `@Mapping(path: string)` decorator to reset the routing address
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

* Use the `@Summary(summary?: string, describe?: string)` decorator to set the description document for the method
```typescript
import Tiny from 'node-tiny';
export class Manager extends Controller {
  @Tiny.Patch()
  @Summary('Test Method')
  public async index(context) {
    // ...
  }
}
```

## Router

* Use `Router` to create a router instance

```typescript
const router = new Router()
```

* `router.options:ConnectOptions` is the routing configuration item
```typescript
type ConnectOptions = {
  prefix?: string;
  format?: boolean;
};
```

* `router.apiJSON:RouterApiJson[]` is the api configuration JSON information, which can be used to generate API documentation
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

* `router.routes:RoutesList` is the configured route list
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

* `router.config(options: ConnectOptions)`Set routing configuration items

* `router.notFound(context: ContextBase)`The route is not found, triggering a 404 error

* `router.work(context: ContextBase)`Routing starts

* `router.register(controller: Controller)`Registering Routes
```typescript
router.register(new Manager());
```

## Model

#### Model

* Use `model<Model>.fill(map: object)` to fill the data model
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

* Use `model<Model>.getConfigCache` to get the current model configuration
```typescript
new LoginInput().getConfigCache();
```

##### ModelResult

* Use `new ModelResult(valid: boolean, message?: string, value?: any)` to set the model validation result

#### Declare

* Use the `@Declare(description?: string)` decorator to declare parameters. Note: Model parameters must use at least `Declare`
```typescript
class LoginInput extends Model {
  @Declare()
  name!: string;
}
```

#### Required

* Use the `@Required(message?: string)` decorator to set the property to be required
```typescript
class LoginInput extends Model {
  @Declare()
  @Required('The name cannot be empty')
  name!: string;
}
```

#### TypeCheck

* Use the `@TypeCheck(type: ParamsType | T, message?: string)` decorator to set type checking
```typescript
class LoginInput extends Model {
  @Declare()
  @TypeCheck(ParamsType.string, 'The name can only be a string')
  name!: string;
}
```

#### ArrayCheck

* Use the `@ArrayCheck(type: ParamsType | T, message?: string, maxLength?: number, maxLengthMessage?: string)` decorator to set array type checking. The precondition is to set `TypeCheck` to `ParamsType.array`
```typescript
class LoginInput extends Model {
  @Declare()
  @TypeCheck(ParamsType.array, 'Lists can only be arrays')
  @ArrayCheck(ParamsType.string, 'The array content can only be strings')
  list!: string[];
}
```

#### StringLength

* Use the `@StringLength(range: number[], message?: string)` decorator to set the string length check. The prerequisite is to set `TypeCheck` to `ParamsType.string`
```typescript
class LoginInput extends Model {
  @Declare()
  @TypeCheck(ParamsType.string, 'The name can only be a string')
  @StringLength([1,50], 'The name length can only be 1-50')
  name!: string;
}
```

#### TypeCustom

* Use the `@TypeCustom<T>(valid: (value: T) => ModelResult)` decorator to set custom validation content and return a `ModelResult`
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

* Use the `@Params.in<T extends Model>(params: { new (): T }, type: ParamsSource, validate: boolean = true)` decorator to set parameter validation
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
* Use the `@Params.out<T extends Model>(result: { new (): T })` decorator to set the output parameter type
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

* Configure `Jwt.sign = <Payload = object>(context: ContextBase, payload: Payload) => string | null | undefined;`Generate token
```typescript
Jwt.sign = (context, payload) => {
  context.cookie.set('token', JSON.stringify(payload));
  return JSON.stringify(payload);
};
```
* Configure `Jwt.verify = (context: ContextBase, next: () => any) => any;` to verify the token
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
* Configure `Jwt.refuse = (context: ContextBase) => any;` to handle verification failure. The default is as follows
```typescript
Jwt.refuse = (context, next) => {
  context.send(StatusCode.success, new Dto({ code: StatusCode.authError, msg: 'No permission to access temporarily', result: null }));
}
```

#### Protected

* Use the `@Protected()` decorator, the configured method will be `Jwt` verified
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

* Use `new Dto({ code: number | string, result?: any, msg?: string })` to set the Response return code

### Values

#### MethodType

* Method Type
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

* The data structure type of body
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

* Parameter source
```typescript
export enum ParamsSource {
  query = 'query',
  body = 'body'
}
```

#### ParamsType

* Parameter Data Type
```typescript
export enum ParamsType {
  number = 'number',
  boolean = 'boolean',
  string = 'string',
  array = 'array'
}
```

#### StatusCode

* Response Status Code
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

## Other


