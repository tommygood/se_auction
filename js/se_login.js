function getId(id) {
			return document.getElementById(id);
		}
		
getId('login').addEventListener('submit', async(e) => {
		e.preventDefault();
		const data = {
			account : getId('account').value,
		};
		//await axios.post('/login/token');
		const checked_data = await axios.post('/se_auction', data);
		console.log(checked_data);
		if (checked_data.data.suc) {
			//alert(checked_data.data.token);
			if (checked_data.data.title == 'cus') {
				window.location.href = '/se_auction/cus';
			}
			else {
				window.location.href = '/se_auction/seller';
			};
		};
	});