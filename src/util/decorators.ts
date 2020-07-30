function changeLoading(keyList: string[]) {
  return function(target: any, methodName: any, desc: any) {
    const oldDesc = desc.value;
    desc.value = async function() {
      keyList.forEach(item => {
        this[item] = true;
      });
      // eslint-disable-next-line
      await oldDesc.apply(this, arguments);
      keyList.forEach(item => {
        this[item] = false;
      });
    };
  };
}

export { changeLoading };
