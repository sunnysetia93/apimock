const Singleton = (function () {
    let instance;
    function createInstance() {
      return {
        increment : (ip)=>{
          return ++instance.map[ip].counter;
        },
        reset : (ip)=>{
          instance.map[ip]= {
            counter:0,
            timestamp:Date.now()
          }
        },
        get : (ip)=>{
          return instance.map[ip];
        },
        set : (ip)=>{
          instance.map[ip] = {
            counter:0,
            timestamp:Date.now()
          }
        }
      }
    }
    return {
      getInstance: function () {
        if(!instance){
          instance = createInstance();
          instance.map={}
        }
        return instance;
      }
    };
  })();

  export default Singleton;