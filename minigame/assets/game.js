
  
  
  GameGlobal.engine = requirePlugin('WXEngine', {
    enableRequireHostModule: true, // 是否允许插件引用宿主的模块，默认 false
    customEnv: { // 传递给插件的值，多次调用传递会覆盖写（Object.assign）
      wx
    }
  })

  /**
   * Register global canvas.
   */
  var canvas = GameGlobal.canvas ? GameGlobal.canvas : (GameGlobal.canvas = wx.createCanvas());
  
  function main() {
    /**
     * Read a json file and return the object.
     * Null will be returned if error occurs when parsing JSON.
     * @param {string} path
     */
    function readJSONSync(path) {
      var manager = wx.getFileSystemManager();
      var res = null;
      res = JSON.parse(manager.readFileSync(path, "utf8"));
      return res;
    }

    /**
     * Try to get the url prefix in configure file.
     */
    var engineConfig = readJSONSync("engine.config.json");
    var urlPrefix = "file:///assets/";
    var globalSetting = {};
    if (engineConfig && (typeof (engineConfig.globalSetting) === "object")) {
      globalSetting = engineConfig.globalSetting;
      if (engineConfig.globalSetting.BaseURL || engineConfig.globalSetting.baseURL) {
        urlPrefix = engineConfig.globalSetting.BaseURL || engineConfig.globalSetting.baseURL;
      }
    }
  
    /**
     * Initialize the engine.
     */
    engine.init(canvas, globalSetting);
  
    /**
     * Console log the platform info.
     */
    if (!engine.device || !engine.device.getGroupPlatform) {
      throw Error("不支持getGroupPlatform接口，请更新小游戏优化方案版本，否则无法使用");
    }
    var platform = engine.device.getGroupPlatform();
    console.log("Platform:", platform || "Devtool");
  
    var registerInfos = [
  {
    "platform": [
      "default"
    ],
    "buildin": "register_1b5a0e32.json",
    "idePack": "register_03a8f0f5.json"
  },
  {
    "platform": [
      "etc1"
    ],
    "buildin": "register_6f756f43.json",
    "idePack": "register_03a8f0f5.json"
  },
  {
    "platform": [
      "etc2"
    ],
    "buildin": "register_73fc2ae4.json",
    "idePack": "register_107d0e3c.json"
  }
]

    /**
     * find register file
     */
    if (typeof platform === "string") {
      platform = !!platform ? [platform] : ["default"];
    }
    var buildinFilePath = "";
    var packFilePath = "";
    for (var i = 0; i < registerInfos.length; i++) {
      if (registerInfos[i].platform[0] === "default") {
        buildinFilePath = registerInfos[i].buildin;
        packFilePath = registerInfos[i].idePack;
        break;
      }
    }

    for (var i = 0; i < registerInfos.length; i++) {
      if (platform.length === registerInfos[i].platform.length) {
        var isSame = platform.every(function fn(v1) {
          return registerInfos[i].platform.some(function fn(v2) {
            return v1 === v2;
          });
        });
        if (!isSame) continue;
        buildinFilePath = registerInfos[i].buildin;
        packFilePath = registerInfos[i].idePack;
      }
    }
  
    var buildinRegisterPath = "file:///assets/" + "IDEBuildIn/" + buildinFilePath;
  
    var packRegisterPath = urlPrefix + "IDEPack/" + packFilePath;
  
    /**
     * not real promise , its LitePromise
     */
    engine.loader.register(buildinRegisterPath, urlPrefix).then(function fn() {
      var buidinAssets = ["System::Effect::Blit", "System::Effect::Bloom", "System::Effect::FXAA", "System::Effect::GrayScale2D", "System::Effect::HDR", "System::Effect::Image2D", "System::Effect::Mask2D", "System::Effect::ShadowCasterFallBack", "System::Effect::Simple3D", "System::Effect::Text2D"];
      var buidinAssetsTasks = [];
      for (var i = 0; i < buidinAssets.length; i++) {
        buidinAssetsTasks.push(engine.loader.load(buidinAssets[i], {
          useFrameSystem: false
        }).promise);
      }

      engine.LitePromise.all(buidinAssetsTasks).then(function(assets) {
        engine.Effect.BuildInEffects = assets;

        /**
         * Create global game.
         */
        var game = GameGlobal.game = new engine.Game(720, 1280);

        function runGame() {

          /**
           * Run the game.
           */
          game.run();
        }

        /**
         * Load entry scenes.
         */
        
    var scenesPromises = [
      engine.loader.load("resource/mygame.scene", { useFrameSystem: false }).promise,
      engine.loader.load("resource/mygame2d.scene", { useFrameSystem: false }).promise
    ];
    engine.LitePromise.all(scenesPromises).then(function(scenes) {
      // 加载pack资源
      
    if(true){
      /**
       * if packRegister.json is very large , you should set engine.ide.json -> build.disableAutoRegisterPack to true, and register handlely or it may make Jank
       */
      engine.loader.register(packRegisterPath, urlPrefix).catch(function fn(error){console.error(error)});
    }
  
      game.playScene(scenes[0]);
      game.playScene(scenes[1]);
      runGame();
    }).catch(function (error){
      console.error('Fail to load scenes.', error.message, error.stack);
      runGame();
    });

      }).catch(function (error){
        console.error('Fail to load buildin assets.', error.message, error.stack);
      });

    }, function fn(error) {
      console.error('buildin 内置资源注册表 加载失败', error.message, error.stack);
    });
  }

  main();
  