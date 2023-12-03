function getId(id) {
    return document.getElementById(id);
}
    
// add new product
getId('sub').addEventListener('click', async(e) => {
    const data = {
        price : getId('price').value
    };
    const checked_data = await axios.post('/se_auction/seller', data);
    window.location.reload();
});

// not selled product
(async() => {
    const {data : record} = await axios.get('/se_auction/getObj');
    var obj_record = record.obj;
    console.log(obj_record);
    for (let i = 0;i < obj_record.length;i++) {
        const {data : obj_price} = await axios.post('/se_auction/obj_price', {pId : obj_record[i].no});
        obj_pos.innerHTML += "<tr id = 'log_row'" + i + "/><td/>" + 
        obj_record[i].no + 
        "<td>" + obj_record[i].price + "</td>" +
        "<td>" + (obj_price.all_price==null ? '無' : obj_price.all_price.price) + "</td>" +
        "<td>" + (obj_record[i].start_sell ? '是' : '否') + "</td>" +
        "<td><button id = 'start_" + i + "'>開標</button></td>" +
        "<td><button id = 'bt_" + i + "'>結標</button></td></tr>"
    }
    btLis(obj_record.length);
    startBtLis(obj_record.length);
})();

// history sells
(async() => {
    const {data : user} = await axios.get('/se_auction/getUId');
    const {data : record} = await axios.post('/se_auction/sellerInsert', {user : user.user});
    var obj_record = record.seller_obj;
    for (let i = 0;i < obj_record.length;i++) {
        seller_his.innerHTML += "<tr id = 'log_row'" + i + "/><td/>" + 
        obj_record[i].pId + 
        "<td>" + obj_record[i].price + "</td></tr>"
    }
})();

// listen to start button
function startBtLis(r_len) {
    for (let i = 0;i < r_len;i++)
        getId('start_'+i).addEventListener('click' , startSubmit);
}

// listen to end button
function btLis(r_len) {
    for (let i = 0;i < r_len;i++)
        getId('bt_'+i).addEventListener('click' , submit);
}

// start sell this product
async function startSubmit(e) {
    const {data : record} = await axios.get('/se_auction/getObj');
    var obj_record = record.obj;
    await axios.post('/se_auction/startAuction', {pId : obj_record[getBtId(e.target.id)].no});
    window.location.reload();
}

// end of auction
async function submit(e) {
    const {data : record} = await axios.get('/se_auction/getObj');
    var obj_record = record.obj;
    const {data : user} = await axios.get('/se_auction/getUId');
    const {data : obj_price} = await axios.post('/se_auction/obj_price', {pId : obj_record[getBtId(e.target.id)].no})
    // check if not sell yet
    if (typeof obj_price.all_price == 'undefined') {
        alert('該商品未售出!');
        return;
    }
    // make user confirm
    var is_confirm = confirm(`結標 編號 : ${obj_record[getBtId(e.target.id)].no}, 價格為 : ${obj_price.all_price.price}`);
    if (is_confirm) {
        // submit
        var suc_push = await axios.post('/se_auction/settle', {price : obj_price.all_price.price, bId :obj_price.all_price.uId, pId : obj_record[getBtId(e.target.id)].no, user : user.user});
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