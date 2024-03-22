function hook_java(){
    Java.perform(function(){
        // Java.use("com.xiaoeryu.demoso1.MainActivity").stringFromJNI.implementation = function(){
        //     var result = this.stringFromJNI();
        //     console.log("stringFromJNI result is => ", result);
        //     return result;
        // }
        // console.log("invoke stringFromJNI: " + Java.use('com.xiaoeryu.demoso1.MainActivity').stringFromJNI);
        // Java.use("com.xiaoeryu.demoso1.MainActivity").stringFromJNI2.implementation = function(){
        //     var result1 = this.stringFromJNI2();
        //     console.log("stringFromJNI2 result1 is => ", result1);
        //     return result1;
        // }
        // console.log("invoke stringFromJNI2: " + Java.use('com.xiaoeryu.demoso1.MainActivity').stringFromJNI2);

        // Java.use('com.xiaoeryu.demoso1.MainActivity').init.implementation = function(){
        //     console.log("hook init successfully!");
        //     return this.init;
        // }
        // Java.choose('com.xiaoeryu.demoso1.MainActivity',{
        //     onMatch:function(instance){
        //         console.log('Found instance');
        //         instance.init();
        //     },onComplete:function(){console.log('Search complete!')}
        // })
        Java.use('com.xiaoeryu.demoso1.MainActivity').myfirstjniJNI.overload('java.lang.String').implementation = function(){
            var result = this.myfirstjniJNI();
            console.log("myfirstjniJNI result is => ", result);
            return result;
        }
    })
}

function java_use(){
    Java.perform(function(){
        Java.use('com.xiaoeryu.demoso1.MainActivity').myfirstjniJNI("night");
    })
}

function hook_nativelib(){
    // var nativelib_addr = Module.findBaseAddress('libdemoso1.so');
    // console.log("nativelib_addr is => ", nativelib_addr);

    var myfirstjniJNI_addr = Module.findExportByName('libdemoso1.so','Java_com_xiaoeryu_demoso1_MainActivity_myfirstjniJNI');
    console.log("myfirstjniJNI_addr is => ", myfirstjniJNI_addr);

    var myfirstjniJNI_invoke = new NativeFunction(myfirstjniJNI_addr, 'pointer', ['pointer','pointer','pointer']);

    Interceptor.attach(myfirstjniJNI_addr, {
        onEnter: function(args){
            console.log("Interceptor.attach myfristjniJNI args: ", args[0], args[1], args[2]);
            console.log("args[2] jstring is ", Java.vm.getEnv().getStringUtfChars(args[2],null).readCString());

            console.log("myfirstjniJNI_invoke result => ", Java.vm.getEnv().getStringUtfChars(myfirstjniJNI_invoke(args[0],args[1],args[2]),null).readCString());

            var newArgs = Java.vm.getEnv().newStringUtf("hookedargs[2]Xiaoyu");
            args[2] = newArgs;
        },onLeave:function(retval){
            console.log("Interceptor.attach myfirstjniJNI retval: ", retval);
            console.log("retval jstring is ", Java.vm.getEnv().getStringUtfChars(retval, null).readCString());

            var newRetval = Java.vm.getEnv().newStringUtf("hookedXiaoyu");
            retval.replace(newRetval);
        }
    })
}

function hookAndInvoke_add(){
    var r0add_addr = Module.findExportByName('libdemoso1.so', '_Z5r0addii');
    console.log("r0add_addr is => ", r0add_addr);

    Interceptor.attach(r0add_addr, {
        onEnter: function(args){
            console.log("x => ", args[0], "y => ", args[1]);

            
            console.log('CCCryptorCreate called from:\n' +
            Thread.backtrace(this.context, Backtracer.ACCURATE)
            .map(DebugSymbol.fromAddress).join('\n') + '\n');
        },onLeave:function(retval){
            console.log("retval => ", retval);
        }
    })

    var r0add = new NativeFunction(r0add_addr, 'int', ['int', 'int']);
    var r0add_result = r0add(1, 2);
    console.log("r0add_result => ", r0add_result);
}

function hook_replace(){
    var myfirstjniJNI_addr = Module.findExportByName('libdemoso1.so', 'Java_com_xiaoeryu_demoso1_MainActivity_myfirstjniJNI');
    console.log("myfirstjniJNI_addr is => ", myfirstjniJNI_addr);

    // var myfirstjniJNI_invoke = new NativeFunction(myfirstjniJNI_addr, 'pointer', ['pointer', 'pointer', 'pointer']);

    Interceptor.replace(myfirstjniJNI_addr, new NativeCallback(function(args0, args1, args2){
        console.log("Interceptor.replace myfirstjniJNI args: ", args0, args1, args2);
        return Java.vm.getEnv().newStringUtf("hookedReplaceXiaoyu");
    }, 'pointer', ['pointer', 'pointer', 'pointer']
    ))
}

function EnumerateAllExports(){
    var modules = Process.enumerateModules();
    // console.log("modules is => ", JSON.stringify(modules));
    for(var i = 0; i < modules.length; i++){
        var module = modules[i];
        var name = module.name;
        var exports = module.enumerateExports();
        console.log("name is => ", JSON.stringify(name), "export is => ", JSON.stringify(exports));
    }
}

function module(){
    var nativelib_addr = Process.findModuleByAddress(Module.findBaseAddress("libutils.so"));
    // var nativelib_addr = Process.findModuleByAddress(Module.findBaseAddress("libdemoso1.so"));
    // console.log("nativelib_addr => ", JSON.stringify(nativelib_addr));
    for(var i = 0; i < nativelib_addr.enumerateImports().length; i++){
        console.log("enumerateSymbols => ", JSON.stringify(nativelib_addr.enumerateImports()[i]));
    }
}

function secondM(){
    Java.perform(function(){
        var imports = Module.enumerateImports("libutils.so");
        for(var i = 0; i < imports.length; i++){
            console.log("imports => ", JSON.stringify(imports[i]));
        }
    })
}

function main(){
    // hook_java();

    // hook_nativelib();
    // java_use();

    // hookAndInvoke_add();
    // hook_replace();
    EnumerateAllExports();
}
setImmediate(main);
