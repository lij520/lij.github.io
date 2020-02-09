var memberDatas = [];
/*根据id获取对象*/
function jq(str) {
    return document.getElementById(str);
}
 
var addrShow = jq('addr-show');
var btn = document.getElementsByClassName('met1')[0];
var prov = jq('prov');
var city = jq('city');
var country = jq('country');
 
/*用于保存当前所选的省市区*/
var current = {
    prov: '',
    city: '',
    country: ''
};
 
/*自动加载省份列表*/
(function showProv() {
    btn.disabled = true;
    var len = provice.length;
    for (var i = 0; i < len; i++) {
        var provOpt = document.createElement('option');
        provOpt.innerText = provice[i]['name'];
        provOpt.value = i;
        prov.appendChild(provOpt);
    }
})();
 
/*根据所选的省份来显示城市列表*/
function showCity(obj) {
    var val = obj.options[obj.selectedIndex].value;
    if (val != current.prov) {
        current.prov = val;
        addrShow.value = '';
        btn.disabled = true;
    }
    //console.log(val);
    if (val != null) {
        city.length = 1;
        var cityLen = provice[val]["city"].length;
        for (var j = 0; j < cityLen; j++) {
            var cityOpt = document.createElement('option');
            cityOpt.innerText = provice[val]["city"][j].name;
            cityOpt.value = j;
            city.appendChild(cityOpt);
        }
    }
}
 
/*根据所选的城市来显示县区列表*/
function showCountry(obj) {
    var val = obj.options[obj.selectedIndex].value;
    current.city = val;
    if (val != null) {
        country.length = 1; //清空之前的内容只留第一个默认选项
        var countryLen = provice[current.prov]["city"][val].districtAndCounty.length;
        if (countryLen == 0) {
            addrShow.value = provice[current.prov].name + '-' + provice[current.prov]["city"][current.city].name;
            return;
        }
        for (var n = 0; n < countryLen; n++) {
            var countryOpt = document.createElement('option');
            countryOpt.innerText = provice[current.prov]["city"][val].districtAndCounty[n];
            countryOpt.value = n;
            country.appendChild(countryOpt);
        }
    }
}
 
/*选择县区之后的处理函数*/
function selecCountry(obj) {
    current.country = obj.options[obj.selectedIndex].value;
    if ((current.city != null) && (current.country != null)) {
        btn.disabled = false;
        showAddr();
    }
}
 
/*点击确定按钮显示用户所选的地址*/
function showAddr() {
    addrShow.value = provice[current.prov].name + '-' + provice[current.prov]["city"][current.city].name + '-' + provice[current.prov]["city"][current.city].districtAndCounty[current.country];
    MemberSelect(addrShow.value);
}


function MemberSelect(zone){
    var name = document.getElementById("name");
    // const addr = zone.replace(/-/g, ',');
    // console.log(addr)
    if(zone){
        $.ajax({
            type:"get",
            url:"http://36.248.23.130:8095/observers/selectPersonList",
            data:{type:3,address:zone},
            // dataType:'json',
            success:function(res){
                console.log('data',res);
                const Fdata = res.data;
                if(Fdata.list.length>0){
                    var Sdata = [];
                    memberDatas = Fdata.list;
                    Fdata.list.map(item=>{
                        Sdata.push(item);
                    });
                    console.log('sdata',Sdata);
                    var lengthT = Sdata.length;
                    for (var k = 0; k < lengthT; k++) {
                        var nameOpt = document.createElement('option');
                        nameOpt.innerText = Sdata[k]['name'];
                        nameOpt.value = Sdata[k]["id"];
                        name.appendChild(nameOpt);
                    }
                }
            },
            error:function(res){
                console.log('数据获取失败',res)
            }
        })
    }
}

function MemberSelected(obj){
    // console.log('objcalie',obj.selectedIndex,obj.options[obj.selectedIndex])
    var index = obj.options[obj.selectedIndex].value;
    console.log('index',index,memberDatas);
}

