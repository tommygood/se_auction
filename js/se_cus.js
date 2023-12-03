function getId(id) {
    return document.getElementById(id);
}

// put product record in
(async() => {
    const {data : record} = await axios.get('/se_auction/getObj');
    var obj_record = record.obj;
    for (let i = 0;i < obj_record.length;i++) {
        const {data : obj_price} = await axios.post('/se_auction/obj_price', {pId : obj_record[i].no});
        obj_pos.innerHTML += "<tr id = 'log_row'" + i + "/><td/>" + 
        obj_record[i].no + 
        "<td>" + obj_record[i].price + "</td>" +
        "<td>" + (obj_price.all_price==null ? '無' : obj_price.all_price.price) + "</td>" +
        "<td>" + (obj_record[i].start_sell ? '是' : '否') + "</td>" +
        "<td><button id = 'bt_" + i + "'>競標</button></td></tr>"
    }
    btLis(obj_record.length);
})();

function btLis(r_len) {
    for (let i = 0;i < r_len;i++)
        getId('bt_'+i).addEventListener('click' , submit);
}

// submit with price
async function submit(e) {
    const {data : record} = await axios.get('/se_auction/getObj');
    var obj_record = record.obj;
    // check whether this product start sell
    if (!obj_record[getBtId(e.target.id)].start_sell) {
        alert('此商品還沒開賣ㄟ');
        return;
    }
    const {data : user} = await axios.get('/se_auction/getUId');
    var price = prompt(`競標 編號 : ${obj_record[getBtId(e.target.id)].no}, 請出價`);
    const {data : obj_price} = await axios.post('/se_auction/obj_price', {pId : obj_record[getBtId(e.target.id)].no})
    // check if higer than origin price
    if (price <= obj_record[getBtId(e.target.id)].price) {
        alert('低於原始價格');
        return;
    }
    // check if higer than had paid price
    if (obj_price.all_price != undefined) {
        if (price <= obj_price.all_price.price) {
            alert('低於目前最高價格');
        }
        else if (price <= obj_record[getBtId(e.target.id)].price) {
            alert('低於原始價格');
        }
        else {
            var suc_push = await axios.post('/se_auction/push', {pId : obj_record[getBtId(e.target.id)].no, price : price, user : user.user});
        }
    }
    else {
            var suc_push = await axios.post('/se_auction/push', {pId : obj_record[getBtId(e.target.id)].no, price : price, user : user.user});
        window.location.reload();
    }
}

function getBtId(bt) {
    var real_id = '';
    var start_add = false;
    for (let i = 0;i < bt.length;i++) {
        if (start_add)
            real_id += bt[i];
        if (bt[i] == "_") {
            start_add = true;
        }
    }
    return real_id;
}
            
// history sells
(async() => {
    const {data : user} = await axios.get('/se_auction/getUId');
    const {data : record} = await axios.post('/se_auction/buyerInsert', {user : user.user});
    var obj_record = record.seller_obj;
    for (let i = 0;i < obj_record.length;i++) {
        seller_his.innerHTML += "<tr id = 'log_row'" + i + "/><td/>" + 
        obj_record[i].pId + 
        "<td>" + obj_record[i].price + "</td></tr>"
    }
})();