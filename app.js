// Global Variables
let currentData = [];
let filteredData = [];
let currentPage = 1;
let rowsPerPage = 20;
let sortColumn = null;
let sortDirection = 'asc';
let chart1Instance = null;
let chart2Instance = null;
let chart3Instance = null;
let chart4Instance = null;
let chart5Instance = null;

// Chart.js neon colors for black theme
const chartColors = ['#00d9ff', '#a855f7', '#ec4899', '#00ff88', '#fbbf24', '#f97316', '#ff0055', '#c084fc', '#22d3ee', '#34d399'];

// Sample Datasets
const sampleDatasets = {
  sales: {
    name: 'Sales Dashboard',
    description: 'Regional sales, revenue & customer metrics',
    data: generateSalesData()
  },
  product: {
    name: 'Product Performance',
    description: 'Product sales, ratings & inventory',
    data: generateProductData()
  },
  customer: {
    name: 'Customer Analytics',
    description: 'Segmentation, churn & satisfaction',
    data: generateCustomerData()
  },
  marketing: {
    name: 'Marketing Metrics',
    description: 'Channel performance & ROI',
    data: generateMarketingData()
  }
};

// Generate Sample Data Functions
function generateSalesData() {
  const regions = ['North America', 'Europe', 'Asia', 'South America', 'Africa'];
  const data = [];
  const startDate = new Date('2024-01-01');
  
  for (let i = 0; i < 100; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + Math.floor(i / 5));
    const region = regions[i % 5];
    
    data.push({
      Date: date.toISOString().split('T')[0],
      Region: region,
      Sales: Math.floor(Math.random() * 200000) + 50000,
      Revenue: Math.floor(Math.random() * 300000) + 100000,
      Customers: Math.floor(Math.random() * 2000) + 500,
      Conversion_Rate: (Math.random() * 5 + 1).toFixed(2),
      Average_Order_Value: (Math.random() * 300 + 100).toFixed(2)
    });
  }
  return data;
}

function generateProductData() {
  const products = ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'];
  const data = [];
  const startDate = new Date('2024-01-01');
  
  for (let i = 0; i < 100; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + Math.floor(i / 5));
    const product = products[i % 5];
    
    data.push({
      Date: date.toISOString().split('T')[0],
      Product: product,
      Units_Sold: Math.floor(Math.random() * 1000) + 100,
      Revenue: Math.floor(Math.random() * 50000) + 10000,
      Returns: Math.floor(Math.random() * 50) + 5,
      Customer_Rating: (Math.random() * 2 + 3).toFixed(1),
      Stock_Level: Math.floor(Math.random() * 5000) + 1000
    });
  }
  return data;
}

function generateCustomerData() {
  const segments = ['Enterprise', 'SMB', 'Startup', 'Individual'];
  const data = [];
  const startDate = new Date('2024-01-01');
  
  for (let i = 0; i < 80; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + Math.floor(i / 4));
    const segment = segments[i % 4];
    
    data.push({
      Date: date.toISOString().split('T')[0],
      Customer_Segment: segment,
      New_Customers: Math.floor(Math.random() * 500) + 50,
      Churn_Rate: (Math.random() * 10 + 2).toFixed(2),
      Lifetime_Value: Math.floor(Math.random() * 50000) + 10000,
      Support_Tickets: Math.floor(Math.random() * 200) + 20,
      Satisfaction_Score: (Math.random() * 2 + 3).toFixed(1)
    });
  }
  return data;
}

function generateMarketingData() {
  const channels = ['Social Media', 'Email', 'SEO', 'Paid Ads', 'Direct'];
  const data = [];
  const startDate = new Date('2024-01-01');
  
  for (let i = 0; i < 100; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + Math.floor(i / 5));
    const channel = channels[i % 5];
    
    data.push({
      Date: date.toISOString().split('T')[0],
      Marketing_Channel: channel,
      Impressions: Math.floor(Math.random() * 100000) + 10000,
      Clicks: Math.floor(Math.random() * 5000) + 500,
      Cost: Math.floor(Math.random() * 10000) + 1000,
      Conversions: Math.floor(Math.random() * 200) + 20,
      ROI: (Math.random() * 5 + 1).toFixed(2)
    });
  }
  return data;
}

// Initialize Event Listeners
function initializeEventListeners() {
  const fileInput = document.getElementById('fileInput');
  const dropZone = document.getElementById('dropZone');
  
  // File input change
  fileInput.addEventListener('change', handleFileSelect);
  
  // Drag and drop
  dropZone.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('dragover', handleDragOver);
  dropZone.addEventListener('dragleave', handleDragLeave);
  dropZone.addEventListener('drop', handleDrop);
}

// File Handling Functions
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    processFile(file);
  }
}

function handleDragOver(event) {
  event.preventDefault();
  event.currentTarget.classList.add('dragover');
}

function handleDragLeave(event) {
  event.currentTarget.classList.remove('dragover');
}

function handleDrop(event) {
  event.preventDefault();
  event.currentTarget.classList.remove('dragover');
  
  const file = event.dataTransfer.files[0];
  if (file) {
    processFile(file);
  }
}

function processFile(file) {
  // Validate file type
  const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  const fileName = file.name.toLowerCase();
  
  if (!fileName.endsWith('.csv') && !fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
    showError('Invalid file type. Please upload a CSV or Excel file.');
    return;
  }
  
  // Show file info
  document.getElementById('fileName').textContent = file.name;
  document.getElementById('fileSize').textContent = formatFileSize(file.size);
  document.getElementById('fileInfo').style.display = 'block';
  
  // Show loading spinner
  showLoading();
  
  // Parse file based on type
  if (fileName.endsWith('.csv')) {
    parseCSV(file);
  } else {
    parseExcel(file);
  }
}

function parseCSV(file) {
  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    complete: function(results) {
      if (results.data && results.data.length > 0) {
        currentData = results.data;
        initializeDashboard();
      } else {
        showError('The file appears to be empty or invalid.');
        hideLoading();
      }
    },
    error: function(error) {
      showError('Error parsing CSV file: ' + error.message);
      hideLoading();
    }
  });
}

function parseExcel(file) {
  const reader = new FileReader();
  
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);
      
      if (jsonData && jsonData.length > 0) {
        currentData = jsonData;
        initializeDashboard();
      } else {
        showError('The Excel file appears to be empty.');
        hideLoading();
      }
    } catch (error) {
      showError('Error parsing Excel file: ' + error.message);
      hideLoading();
    }
  };
  
  reader.onerror = function() {
    showError('Error reading file.');
    hideLoading();
  };
  
  reader.readAsArrayBuffer(file);
}

// Sample Data Loading
function loadSampleData(type) {
  showLoading();
  
  setTimeout(() => {
    currentData = sampleDatasets[type].data;
    initializeDashboard();
  }, 500);
}

// Dashboard Initialization
function initializeDashboard() {
  if (!currentData || currentData.length === 0) {
    showError('No data to display.');
    hideLoading();
    return;
  }
  
  filteredData = [...currentData];
  
  // Hide upload section, show dashboard
  document.getElementById('uploadSection').style.display = 'none';
  document.getElementById('dashboardSection').style.display = 'block';
  hideLoading();
  
  // Show summarize buttons
  document.getElementById('headerSummarizeBtn').style.display = 'inline-flex';
  document.getElementById('floatingSummarizeBtn').style.display = 'flex';
  
  // Initialize all dashboard components
  createSummaryCards();
  populateFilterControls();
  updateCharts();
  renderTable();
  
  // Regenerate AI summary with filtered data
  if (document.getElementById('aiSummarySection').style.display !== 'none') {
    generateAISummary();
  }
  
  // Generate AI summary
  setTimeout(() => generateAISummary(), 500);
}

// Summary Cards
function createSummaryCards() {
  const container = document.getElementById('summaryCards');
  const columns = Object.keys(currentData[0]);
  const numericColumns = columns.filter(col => isNumericColumn(col));
  
  let cards = [];
  
  // Total Records Card
  cards.push({
    title: 'Total Records',
    value: currentData.length.toLocaleString(),
    icon: '📊',
    type: 'neutral'
  });
  
  // Numeric column cards (up to 5 more)
  numericColumns.slice(0, 5).forEach(col => {
    const values = currentData.map(row => parseFloat(row[col]) || 0);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    
    cards.push({
      title: col.replace(/_/g, ' '),
      value: formatNumber(sum),
      icon: getIconForColumn(col),
      type: 'neutral',
      subtitle: `Avg: ${formatNumber(avg)}`
    });
  });
  
  container.innerHTML = cards.map(card => `
    <div class="summary-card">
      <div class="summary-card-header">
        <span class="summary-card-title">${card.title}</span>
        <span class="summary-card-icon">${card.icon}</span>
      </div>
      <div class="summary-card-value">${card.value}</div>
      ${card.subtitle ? `<div class="summary-card-change ${card.type}">${card.subtitle}</div>` : ''}
    </div>
  `).join('');
}

// Filter Controls
function populateFilterControls() {
  const columns = Object.keys(currentData[0]);
  const numericColumns = columns.filter(col => isNumericColumn(col));
  const categoricalColumns = columns.filter(col => !isNumericColumn(col));
  
  // X-Axis (categorical)
  const xSelect = document.getElementById('xAxisSelect');
  xSelect.innerHTML = categoricalColumns.map(col => 
    `<option value="${col}">${col.replace(/_/g, ' ')}</option>`
  ).join('');
  
  // Y-Axis (numeric)
  const ySelect = document.getElementById('yAxisSelect');
  ySelect.innerHTML = numericColumns.map(col => 
    `<option value="${col}">${col.replace(/_/g, ' ')}</option>`
  ).join('');
  
  // Category filters
  if (categoricalColumns.length > 0) {
    const firstCategorical = categoricalColumns[0];
    const uniqueValues = [...new Set(currentData.map(row => row[firstCategorical]))];
    
    document.getElementById('categoryFilterGroup').style.display = 'block';
    const filterContainer = document.getElementById('categoryFilters');
    
    filterContainer.innerHTML = uniqueValues.slice(0, 10).map(value => `
      <label class="category-filter-item">
        <input type="checkbox" value="${value}" checked onchange="applyFilters()">
        <span>${value}</span>
      </label>
    `).join('');
  }
}

// Apply Filters
function applyFilters() {
  const checkboxes = document.querySelectorAll('#categoryFilters input[type="checkbox"]');
  const selectedValues = Array.from(checkboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);
  
  if (selectedValues.length === 0) {
    filteredData = [...currentData];
  } else {
    const xAxis = document.getElementById('xAxisSelect').value;
    filteredData = currentData.filter(row => selectedValues.includes(String(row[xAxis])));
  }
  
  updateCharts();
  renderTable();
}

// Update Charts
function updateCharts() {
  const xAxis = document.getElementById('xAxisSelect').value;
  const yAxis = document.getElementById('yAxisSelect').value;
  const columns = Object.keys(filteredData[0]);
  const numericColumns = columns.filter(col => isNumericColumn(col));
  
  // Aggregate data by X-axis
  const aggregated = {};
  
  filteredData.forEach(row => {
    const key = row[xAxis];
    const value = parseFloat(row[yAxis]) || 0;
    
    if (!aggregated[key]) {
      aggregated[key] = { sum: 0, count: 0, values: [] };
    }
    aggregated[key].sum += value;
    aggregated[key].count += 1;
    aggregated[key].values.push(value);
  });
  
  // Sort by value (highest to lowest)
  const sortedEntries = Object.entries(aggregated).sort((a, b) => b[1].sum - a[1].sum).slice(0, 15);
  const labels = sortedEntries.map(e => e[0]);
  const dataValues = sortedEntries.map(e => e[1].sum);
  
  // Chart 1 - Horizontal Bar Chart (sorted by value)
  createHorizontalBarChart('chart1', labels, dataValues, yAxis.replace(/_/g, ' '));
  
  // Chart 2 - Grouped Bar Chart (multi-metric comparison)
  createGroupedBarChart('chart2', xAxis, numericColumns);
  
  // Chart 3 - Scatter Plot (correlation analysis)
  createScatterPlot('chart3', numericColumns);
  
  // Chart 4 - Trend Analysis (Line/Area Chart)
  createTrendChart('chart4', columns);
  
  // Chart 5 - Combination Chart (Bar + Line)
  createCombinationChart('chart5', xAxis, numericColumns);
}

// Chart 1: Horizontal Bar Chart (sorted by value)
function createHorizontalBarChart(canvasId, labels, data, label) {
  const ctx = document.getElementById(canvasId);
  if (chart1Instance) chart1Instance.destroy();
  
  chart1Instance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: data,
        backgroundColor: '#00d9ff',
        borderColor: '#00f0ff',
        borderWidth: 2,
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          titleColor: '#ffffff',
          bodyColor: '#cccccc',
          borderColor: '#00d9ff',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: function(context) {
              return label + ': ' + formatNumber(context.parsed.x);
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(34, 34, 34, 0.5)' },
          ticks: { 
            color: '#cccccc',
            callback: function(value) {
              return formatNumber(value);
            }
          }
        },
        y: {
          grid: { color: 'rgba(34, 34, 34, 0.5)' },
          ticks: { color: '#cccccc' }
        }
      }
    }
  });
}

// Chart 2: Grouped Bar Chart (multi-metric comparison)
function createGroupedBarChart(canvasId, xAxis, numericColumns) {
  const ctx = document.getElementById(canvasId);
  if (chart2Instance) chart2Instance.destroy();
  
  // Use up to 3 numeric metrics
  const metrics = numericColumns.slice(0, 3);
  const aggregated = {};
  
  filteredData.forEach(row => {
    const key = row[xAxis];
    if (!aggregated[key]) {
      aggregated[key] = {};
      metrics.forEach(m => aggregated[key][m] = 0);
    }
    metrics.forEach(m => {
      aggregated[key][m] += parseFloat(row[m]) || 0;
    });
  });
  
  const labels = Object.keys(aggregated).slice(0, 10);
  const datasets = metrics.map((metric, idx) => ({
    label: metric.replace(/_/g, ' '),
    data: labels.map(label => aggregated[label][metric]),
    backgroundColor: chartColors[idx],
    borderColor: chartColors[idx],
    borderWidth: 2,
    borderRadius: 4
  }));
  
  chart2Instance = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { color: '#ffffff', padding: 10, font: { size: 11 } }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          titleColor: '#ffffff',
          bodyColor: '#cccccc',
          borderColor: '#00d9ff',
          borderWidth: 1,
          padding: 12
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(34, 34, 34, 0.5)' },
          ticks: { color: '#cccccc', maxRotation: 45 }
        },
        y: {
          grid: { color: 'rgba(34, 34, 34, 0.5)' },
          ticks: { 
            color: '#cccccc',
            callback: function(value) { return formatNumber(value); }
          }
        }
      }
    }
  });
}

// Chart 3: Scatter Plot (correlation analysis)
function createScatterPlot(canvasId, numericColumns) {
  const ctx = document.getElementById(canvasId);
  if (chart3Instance) chart3Instance.destroy();
  
  if (numericColumns.length < 2) {
    chart3Instance = createPlaceholderChart(ctx, 'Need at least 2 numeric columns for correlation analysis');
    return;
  }
  
  const xMetric = numericColumns[0];
  const yMetric = numericColumns[1];
  const bubbleMetric = numericColumns[2] || null;
  
  const scatterData = filteredData.slice(0, 100).map(row => {
    const point = {
      x: parseFloat(row[xMetric]) || 0,
      y: parseFloat(row[yMetric]) || 0
    };
    if (bubbleMetric) {
      point.r = Math.max(5, Math.min(25, (parseFloat(row[bubbleMetric]) || 0) / 100));
    }
    return point;
  });
  
  chart3Instance = new Chart(ctx, {
    type: bubbleMetric ? 'bubble' : 'scatter',
    data: {
      datasets: [{
        label: `${yMetric.replace(/_/g, ' ')} vs ${xMetric.replace(/_/g, ' ')}`,
        data: scatterData,
        backgroundColor: 'rgba(0, 217, 255, 0.6)',
        borderColor: '#00d9ff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          titleColor: '#ffffff',
          bodyColor: '#cccccc',
          borderColor: '#00d9ff',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: function(context) {
              return `${xMetric}: ${formatNumber(context.parsed.x)}, ${yMetric}: ${formatNumber(context.parsed.y)}`;
            }
          }
        }
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          grid: { color: 'rgba(34, 34, 34, 0.5)' },
          ticks: { color: '#cccccc' },
          title: {
            display: true,
            text: xMetric.replace(/_/g, ' '),
            color: '#ffffff'
          }
        },
        y: {
          grid: { color: 'rgba(34, 34, 34, 0.5)' },
          ticks: { color: '#cccccc' },
          title: {
            display: true,
            text: yMetric.replace(/_/g, ' '),
            color: '#ffffff'
          }
        }
      }
    }
  });
}

// Chart 4: Trend Analysis (Line/Area Chart)
function createTrendChart(canvasId, columns) {
  const ctx = document.getElementById(canvasId);
  if (chart4Instance) chart4Instance.destroy();
  
  const dateColumn = columns.find(col => col.toLowerCase().includes('date'));
  const numericColumns = columns.filter(col => isNumericColumn(col));
  
  if (!dateColumn || numericColumns.length === 0) {
    chart4Instance = createPlaceholderChart(ctx, 'Need date column and numeric data for trend analysis');
    return;
  }
  
  // Aggregate by date
  const dateAgg = {};
  filteredData.forEach(row => {
    const date = row[dateColumn];
    if (!dateAgg[date]) {
      dateAgg[date] = {};
      numericColumns.slice(0, 2).forEach(col => dateAgg[date][col] = 0);
    }
    numericColumns.slice(0, 2).forEach(col => {
      dateAgg[date][col] += parseFloat(row[col]) || 0;
    });
  });
  
  const dates = Object.keys(dateAgg).sort().slice(0, 30);
  const datasets = numericColumns.slice(0, 2).map((col, idx) => ({
    label: col.replace(/_/g, ' '),
    data: dates.map(date => dateAgg[date][col]),
    backgroundColor: `${chartColors[idx]}40`,
    borderColor: chartColors[idx],
    borderWidth: 3,
    fill: true,
    tension: 0.4,
    pointRadius: 4,
    pointHoverRadius: 6
  }));
  
  chart4Instance = new Chart(ctx, {
    type: 'line',
    data: { labels: dates, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { color: '#ffffff', padding: 10, font: { size: 11 } }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          titleColor: '#ffffff',
          bodyColor: '#cccccc',
          borderColor: '#00d9ff',
          borderWidth: 1,
          padding: 12,
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(34, 34, 34, 0.5)' },
          ticks: { color: '#cccccc', maxRotation: 45 }
        },
        y: {
          grid: { color: 'rgba(34, 34, 34, 0.5)' },
          ticks: { 
            color: '#cccccc',
            callback: function(value) { return formatNumber(value); }
          }
        }
      }
    }
  });
}

// Chart 5: Combination Chart (Bar + Line)
function createCombinationChart(canvasId, xAxis, numericColumns) {
  const ctx = document.getElementById(canvasId);
  if (chart5Instance) chart5Instance.destroy();
  
  if (numericColumns.length < 2) {
    chart5Instance = createPlaceholderChart(ctx, 'Need at least 2 metrics for combination chart');
    return;
  }
  
  const barMetric = numericColumns[0];
  const lineMetric = numericColumns[1];
  
  const aggregated = {};
  filteredData.forEach(row => {
    const key = row[xAxis];
    if (!aggregated[key]) {
      aggregated[key] = { bar: 0, line: 0, count: 0 };
    }
    aggregated[key].bar += parseFloat(row[barMetric]) || 0;
    aggregated[key].line += parseFloat(row[lineMetric]) || 0;
    aggregated[key].count += 1;
  });
  
  const labels = Object.keys(aggregated).slice(0, 12);
  
  chart5Instance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          type: 'bar',
          label: barMetric.replace(/_/g, ' '),
          data: labels.map(l => aggregated[l].bar),
          backgroundColor: 'rgba(0, 217, 255, 0.7)',
          borderColor: '#00d9ff',
          borderWidth: 2,
          borderRadius: 4,
          yAxisID: 'y'
        },
        {
          type: 'line',
          label: lineMetric.replace(/_/g, ' '),
          data: labels.map(l => aggregated[l].line),
          backgroundColor: 'rgba(168, 85, 247, 0.2)',
          borderColor: '#a855f7',
          borderWidth: 3,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 7,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { color: '#ffffff', padding: 15, font: { size: 12 } }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          titleColor: '#ffffff',
          bodyColor: '#cccccc',
          borderColor: '#00d9ff',
          borderWidth: 1,
          padding: 12
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(34, 34, 34, 0.5)' },
          ticks: { color: '#cccccc', maxRotation: 45 }
        },
        y: {
          type: 'linear',
          position: 'left',
          grid: { color: 'rgba(34, 34, 34, 0.5)' },
          ticks: { 
            color: '#cccccc',
            callback: function(value) { return formatNumber(value); }
          },
          title: {
            display: true,
            text: barMetric.replace(/_/g, ' '),
            color: '#00d9ff'
          }
        },
        y1: {
          type: 'linear',
          position: 'right',
          grid: { display: false },
          ticks: { 
            color: '#a855f7',
            callback: function(value) { return formatNumber(value); }
          },
          title: {
            display: true,
            text: lineMetric.replace(/_/g, ' '),
            color: '#a855f7'
          }
        }
      }
    }
  });
}

// Placeholder chart for missing data scenarios
function createPlaceholderChart(ctx, message) {
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['No Data'],
      datasets: [{
        label: message,
        data: [0],
        backgroundColor: 'rgba(136, 136, 136, 0.3)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      },
      scales: {
        x: { display: false },
        y: { display: false }
      }
    }
  });
}

// Table Rendering
function renderTable() {
  const thead = document.getElementById('tableHead');
  const tbody = document.getElementById('tableBody');
  
  if (filteredData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="100" style="text-align: center; padding: 2rem;">No data to display</td></tr>';
    return;
  }
  
  const columns = Object.keys(filteredData[0]);
  
  // Render header
  thead.innerHTML = `
    <tr>
      ${columns.map(col => `
        <th onclick="sortTable('${col}')" class="${sortColumn === col ? 'sort-' + sortDirection : ''}">
          ${col.replace(/_/g, ' ')}
        </th>
      `).join('')}
    </tr>
  `;
  
  // Paginate data
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageData = filteredData.slice(start, end);
  
  // Render body
  tbody.innerHTML = pageData.map(row => `
    <tr>
      ${columns.map(col => `<td>${formatCellValue(row[col])}</td>`).join('')}
    </tr>
  `).join('');
  
  // Render pagination
  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const pagination = document.getElementById('pagination');
  
  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }
  
  let paginationHTML = `
    <button class="pagination-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
      ← Previous
    </button>
  `;
  
  // Page numbers
  const maxButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);
  
  if (endPage - startPage < maxButtons - 1) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
      <button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
        ${i}
      </button>
    `;
  }
  
  paginationHTML += `
    <button class="pagination-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
      Next →
    </button>
    <span class="pagination-info">Page ${currentPage} of ${totalPages}</span>
  `;
  
  pagination.innerHTML = paginationHTML;
}

function changePage(page) {
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    renderTable();
  }
}

function changeRowsPerPage() {
  rowsPerPage = parseInt(document.getElementById('rowsPerPage').value);
  currentPage = 1;
  renderTable();
}

// Table Sorting
function sortTable(column) {
  if (sortColumn === column) {
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn = column;
    sortDirection = 'asc';
  }
  
  filteredData.sort((a, b) => {
    let aVal = a[column];
    let bVal = b[column];
    
    // Handle numeric values
    if (!isNaN(aVal) && !isNaN(bVal)) {
      aVal = parseFloat(aVal);
      bVal = parseFloat(bVal);
    }
    
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  renderTable();
}

// Table Search/Filter
function filterTable() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  
  if (!searchTerm) {
    filteredData = [...currentData];
  } else {
    filteredData = currentData.filter(row => {
      return Object.values(row).some(value => 
        String(value).toLowerCase().includes(searchTerm)
      );
    });
  }
  
  currentPage = 1;
  renderTable();
  updateCharts();
}

// Export Functions
function exportData() {
  const csv = Papa.unparse(filteredData);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'dashboard-data-' + new Date().toISOString().split('T')[0] + '.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// Reset Dashboard
function resetDashboard() {
  currentData = [];
  filteredData = [];
  currentPage = 1;
  sortColumn = null;
  sortDirection = 'asc';
  
  document.getElementById('uploadSection').style.display = 'block';
  document.getElementById('dashboardSection').style.display = 'none';
  document.getElementById('fileInfo').style.display = 'none';
  document.getElementById('fileInput').value = '';
  document.getElementById('aiSummarySection').style.display = 'none';
  document.getElementById('headerSummarizeBtn').style.display = 'none';
  document.getElementById('floatingSummarizeBtn').style.display = 'none';
  
  if (chart1Instance) {
    chart1Instance.destroy();
    chart1Instance = null;
  }
  if (chart2Instance) {
    chart2Instance.destroy();
    chart2Instance = null;
  }
  if (chart3Instance) {
    chart3Instance.destroy();
    chart3Instance = null;
  }
  if (chart4Instance) {
    chart4Instance.destroy();
    chart4Instance = null;
  }
  if (chart5Instance) {
    chart5Instance.destroy();
    chart5Instance = null;
  }
}

// Utility Functions
function isNumericColumn(columnName) {
  const sample = currentData.slice(0, 10);
  const numericCount = sample.filter(row => {
    const value = row[columnName];
    return !isNaN(value) && value !== null && value !== '';
  }).length;
  
  return numericCount > sample.length * 0.5;
}

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toFixed(0);
}

function formatCellValue(value) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  if (typeof value === 'number') {
    return value.toLocaleString();
  }
  return value;
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getIconForColumn(column) {
  const col = column.toLowerCase();
  if (col.includes('revenue') || col.includes('sales') || col.includes('value')) return '💰';
  if (col.includes('customer')) return '👥';
  if (col.includes('rate') || col.includes('roi')) return '📈';
  if (col.includes('cost')) return '💵';
  if (col.includes('units') || col.includes('stock')) return '📦';
  return '📊';
}

function showLoading() {
  document.getElementById('loadingSpinner').style.display = 'block';
  document.getElementById('uploadSection').style.display = 'none';
  hideError();
}

function hideLoading() {
  document.getElementById('loadingSpinner').style.display = 'none';
}

function showError(message) {
  document.getElementById('errorText').textContent = message;
  document.getElementById('errorMessage').style.display = 'flex';
  setTimeout(hideError, 5000);
}

function hideError() {
  document.getElementById('errorMessage').style.display = 'none';
}

// AI Summary Generation
function generateAISummary() {
  if (!filteredData || filteredData.length === 0) {
    return;
  }

  const columns = Object.keys(filteredData[0]);
  const numericColumns = columns.filter(col => isNumericColumn(col));
  const categoricalColumns = columns.filter(col => !isNumericColumn(col));

  let summaryHTML = '';

  // Overview Section
  const totalRecords = filteredData.length;
  const dateColumn = columns.find(col => col.toLowerCase().includes('date'));
  let dateRange = 'N/A';
  
  if (dateColumn) {
    const dates = filteredData.map(r => r[dateColumn]).filter(d => d);
    if (dates.length > 0) {
      const sortedDates = dates.sort();
      dateRange = `${sortedDates[0]} to ${sortedDates[sortedDates.length - 1]}`;
    }
  }

  summaryHTML += `
    <div class="ai-summary-overview">
      <p><strong>Data Overview:</strong> Based on your data analysis of <span class="ai-summary-highlight">${totalRecords.toLocaleString()} records</span>${dateRange !== 'N/A' ? ` spanning <span class="ai-summary-highlight">${dateRange}</span>` : ''}, here are the key insights:</p>
    </div>
  `;

  // Key Findings
  summaryHTML += '<div class="ai-summary-section-title">🔍 Key Findings</div><ul class="ai-summary-list">';

  // Analyze numeric columns
  const findings = [];
  numericColumns.slice(0, 3).forEach(col => {
    const values = filteredData.map(row => parseFloat(row[col]) || 0);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const maxRow = filteredData.find(r => parseFloat(r[col]) === max);
    
    if (categoricalColumns.length > 0) {
      const categoryCol = categoricalColumns[0];
      const category = maxRow ? maxRow[categoryCol] : 'Unknown';
      findings.push(`<li>Highest <span class="ai-summary-highlight">${col.replace(/_/g, ' ')}</span>: <span class="ai-summary-positive">${formatNumber(max)}</span> from ${category}</li>`);
    } else {
      findings.push(`<li>Average <span class="ai-summary-highlight">${col.replace(/_/g, ' ')}</span>: <span class="ai-summary-highlight">${formatNumber(avg)}</span> (Range: ${formatNumber(min)} - ${formatNumber(max)})</li>`);
    }
  });

  // Category analysis
  if (categoricalColumns.length > 0) {
    const firstCat = categoricalColumns[0];
    const uniqueCategories = [...new Set(filteredData.map(r => r[firstCat]))];
    findings.push(`<li>Analysis covers <span class="ai-summary-highlight">${uniqueCategories.length} ${firstCat.replace(/_/g, ' ').toLowerCase()}</span> categories</li>`);
    
    if (numericColumns.length > 0) {
      const metric = numericColumns[0];
      const categoryTotals = {};
      filteredData.forEach(row => {
        const cat = row[firstCat];
        const val = parseFloat(row[metric]) || 0;
        categoryTotals[cat] = (categoryTotals[cat] || 0) + val;
      });
      const topCategory = Object.keys(categoryTotals).reduce((a, b) => 
        categoryTotals[a] > categoryTotals[b] ? a : b
      );
      findings.push(`<li>Top performer: <span class="ai-summary-positive">${topCategory}</span> with total ${metric.replace(/_/g, ' ').toLowerCase()} of <span class="ai-summary-positive">${formatNumber(categoryTotals[topCategory])}</span></li>`);
    }
  }

  summaryHTML += findings.join('') + '</ul>';

  // Performance Indicators
  summaryHTML += '<div class="ai-summary-section-title">🎯 Performance Indicators</div><ul class="ai-summary-list">';
  const performance = [];

  if (numericColumns.length > 0 && categoricalColumns.length > 0) {
    const metric = numericColumns[0];
    const category = categoricalColumns[0];
    const categoryAvgs = {};
    
    filteredData.forEach(row => {
      const cat = row[category];
      const val = parseFloat(row[metric]) || 0;
      if (!categoryAvgs[cat]) categoryAvgs[cat] = { sum: 0, count: 0 };
      categoryAvgs[cat].sum += val;
      categoryAvgs[cat].count += 1;
    });

    const avgValues = Object.entries(categoryAvgs).map(([cat, data]) => ({
      category: cat,
      avg: data.sum / data.count
    })).sort((a, b) => b.avg - a.avg);

    if (avgValues.length > 0) {
      performance.push(`<li>✅ <span class="ai-summary-positive">${avgValues[0].category}</span> is performing well with an average of <span class="ai-summary-positive">${formatNumber(avgValues[0].avg)}</span> in ${metric.replace(/_/g, ' ').toLowerCase()}</li>`);
      
      if (avgValues.length > 1) {
        const lastIdx = avgValues.length - 1;
        const percentDiff = ((avgValues[0].avg - avgValues[lastIdx].avg) / avgValues[lastIdx].avg * 100).toFixed(1);
        performance.push(`<li>📉 <span class="ai-summary-negative">${avgValues[lastIdx].category}</span> needs attention - performing ${percentDiff}% below the top performer</li>`);
      }
    }
  }

  performance.push(`<li>📊 Overall data health: <span class="ai-summary-positive">Good</span> - ${totalRecords} complete records analyzed</li>`);
  summaryHTML += performance.join('') + '</ul>';

  // Actionable Recommendations
  summaryHTML += '<div class="ai-summary-section-title">💡 Actionable Recommendations</div><ul class="ai-summary-list recommendations">';
  const recommendations = [];

  if (categoricalColumns.length > 0 && numericColumns.length > 0) {
    const category = categoricalColumns[0];
    const metric = numericColumns[0];
    const categoryTotals = {};
    
    filteredData.forEach(row => {
      const cat = row[category];
      const val = parseFloat(row[metric]) || 0;
      categoryTotals[cat] = (categoryTotals[cat] || 0) + val;
    });

    const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    const topCat = sorted[0];
    const bottomCat = sorted[sorted.length - 1];
    
    if (topCat) {
      const percentOfTotal = (topCat[1] / Object.values(categoryTotals).reduce((a,b) => a+b, 0) * 100).toFixed(1);
      recommendations.push(`<li>Focus marketing efforts on <span class="ai-summary-highlight">${topCat[0]}</span> which represents ${percentOfTotal}% of total ${metric.replace(/_/g, ' ').toLowerCase()} - this is your strongest performer</li>`);
    }
    
    if (bottomCat && sorted.length > 1) {
      recommendations.push(`<li>Investigate <span class="ai-summary-highlight">${bottomCat[0]}</span> performance - consider rebranding, resource reallocation, or targeted improvement initiatives</li>`);
    }
  }

  recommendations.push('<li>Continue monitoring key metrics and adjust strategies based on data-driven insights');
  recommendations.push('<li>Set up automated alerts for significant changes in performance indicators</li>');
  recommendations.push('<li>Consider A/B testing different approaches in underperforming categories</li>');
  
  summaryHTML += recommendations.join('') + '</ul>';

  // Risk Alerts (if applicable)
  const risks = [];
  if (numericColumns.length > 0) {
    const metric = numericColumns[0];
    const values = filteredData.map(r => parseFloat(r[metric]) || 0);
    const avg = values.reduce((a,b) => a+b, 0) / values.length;
    const recentValues = values.slice(-10);
    const recentAvg = recentValues.reduce((a,b) => a+b, 0) / recentValues.length;
    
    if (recentAvg < avg * 0.9) {
      const decline = ((avg - recentAvg) / avg * 100).toFixed(1);
      risks.push(`<li>⚠️ Declining trend detected in ${metric.replace(/_/g, ' ')} - down ${decline}% from average. Immediate attention recommended.</li>`);
    }
  }

  if (categoricalColumns.length > 1) {
    const categories = [...new Set(filteredData.map(r => r[categoricalColumns[0]]))];
    if (categories.length < 3) {
      risks.push('<li>⚠️ Limited category diversity detected - consider expanding to reduce concentration risk</li>');
    }
  }

  if (risks.length > 0) {
    summaryHTML += '<div class="ai-summary-section-title" style="color: #ff0055;">⚠️ Risk Alerts</div><ul class="ai-summary-list risks">';
    summaryHTML += risks.join('') + '</ul>';
  }

  // Insert summary into DOM
  document.getElementById('aiSummaryContent').innerHTML = summaryHTML;
  document.getElementById('aiSummarySection').style.display = 'block';
}

// Scroll to AI Summary Section
function scrollToSummary() {
  const summarySection = document.getElementById('aiSummarySection');
  if (summarySection) {
    summarySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Regenerate summary with latest data
    generateAISummary();
  }
}

// Download Dashboard as PDF Function
async function downloadDashboard() {
  // Check if data is loaded
  if (!currentData || currentData.length === 0) {
    alert('No data to download. Please load data first.');
    return;
  }
  
  // Get the download button
  const downloadBtn = document.querySelector('.download-dashboard-btn');
  const originalText = downloadBtn.innerHTML;
  
  // Change button state
  downloadBtn.innerHTML = '⏳ Generating PDF...';
  downloadBtn.disabled = true;
  
  try {
    // Get the dashboard container
    const dashboardElement = document.querySelector('.dashboard-content');
    
    // Temporarily apply PDF-friendly styles
    document.body.classList.add('pdf-mode');
    
    // Wait for styles to apply
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Use html2canvas to capture the dashboard
    const canvas = await html2canvas(dashboardElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: 1200
    });
    
    // Remove PDF mode class
    document.body.classList.remove('pdf-mode');
    
    // Create PDF with jsPDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jspdf.jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    
    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // Add more pages if content is longer than one page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `AlgoDash_Report_${timestamp}.pdf`;
    
    // Download the PDF
    pdf.save(filename);
    
    // Show success message briefly
    downloadBtn.innerHTML = '✅ Downloaded!';
    setTimeout(() => {
      downloadBtn.innerHTML = originalText;
      downloadBtn.disabled = false;
    }, 2000);
    
  } catch (error) {
    console.error('PDF generation error:', error);
    downloadBtn.innerHTML = '❌ Error - Try Again';
    setTimeout(() => {
      downloadBtn.innerHTML = originalText;
      downloadBtn.disabled = false;
    }, 2000);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeEventListeners);