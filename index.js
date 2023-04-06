const cg = require('coingecko-api');

const coingeckoClient = new cg();

async function getTopCoinsByVolumeToMarketCap() {
  const coins = await coingeckoClient.coins.all();
  
  const topCoins = coins
    .filter((coin) => coin.market_data.market_cap.usd >= 50000000)
    .map((coin) => ({
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: coin.market_data.current_price.usd,
      volume: coin.market_data.total_volume.usd,
      marketCap: coin.market_data.market_cap.usd,
      volumeToMarketCapRatio: coin.market_data.total_volume.usd / coin.market_data.market_cap.usd,
    }))
    .sort((a, b) => b.volumeToMarketCapRatio - a.volumeToMarketCapRatio)
    .slice(0, 10);

  return topCoins;
}

async function renderTable() {
  const coinData = await getTopCoinsByVolumeToMarketCap();

  const tbody = document.getElementById('coin-data');

  coinData.forEach((coin, index) => {
    const row = document.createElement('tr');

    const rankCol = document.createElement('td');
    rankCol.textContent = `${index + 1}`;
    rankCol.classList.add('px-4', 'py-2', 'text-gray-700', 'text-center');
    row.appendChild(rankCol);

    const nameCol = document.createElement('td');
    nameCol.textContent = coin.name;
    nameCol.classList.add('px-4', 'py-2', 'text-gray-700', 'font-bold');
    row.appendChild(nameCol);

    const symbolCol = document.createElement('td');
    symbolCol.textContent = coin.symbol;
    symbolCol.classList.add('px-4', 'py-2', 'text-gray-700', 'text-center');
    row.appendChild(symbolCol);

    const ratioCol = document.createElement('td');
    ratioCol.textContent = coin.volumeToMarketCapRatio.toFixed(2);
    ratioCol.classList.add('px-4', 'py-2', 'text-gray-700', 'text-center');
    row.appendChild(ratioCol);

    const priceCol = document.createElement('td');
    priceCol.textContent = `$${coin.price.toFixed(2)}`;
    priceCol.classList.add('px-4', 'py-2', 'text-gray-700', 'text-center');
    row.appendChild(priceCol);

    tbody.appendChild(row);
  });
}

renderTable();
