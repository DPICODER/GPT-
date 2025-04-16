<!DOCTYPE html><html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GST Data Mapping</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    .incomplete-cell {
      background-color: #fff3cd;
    }
    .edit-panel {
      position: fixed;
      top: 0;
      right: -400px;
      width: 400px;
      height: 100vh;
      background: #f8f9fa;
      box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
      transition: right 0.3s ease-in-out;
      overflow-y: auto;
      padding: 20px;
      z-index: 1050;
    }
    .edit-panel.open {
      right: 0;
    }
    .progress-msg {
      font-size: 0.9rem;
      color: #6c757d;
    }
    .table-responsive {
      overflow-x: auto;
    }
    th.sticky-col, td.sticky-col {
      position: sticky;
      left: 0;
      background: white;
      z-index: 1;
    }
    th.sticky-col-2, td.sticky-col-2 {
      position: sticky;
      left: 60px;
      background: white;
      z-index: 1;
    }
  </style>
</head>
<body>
<div class="container mt-4">
  <h2>GST Data Table</h2>
  <div class="table-responsive">
    <table class="table table-bordered table-hover">
      <thead class="table-dark">
        <tr>
          <th class="sticky-col">ID</th>
          <th class="sticky-col-2">Name</th>
          <th>GST Number</th>
          <th>Business Type</th>
          <th>State</th>
          <th>City</th>
          <th>Pincode</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Turnover</th>
          <th>Registered Date</th>
          <th>Category</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody id="dataTable">
        <tr>
          <td class="sticky-col">1</td>
          <td class="sticky-col-2">Sharma Traders</td>
          <td class="incomplete-cell"></td>
          <td class="incomplete-cell"></td>
          <td>Maharashtra</td>
          <td>Pune</td>
          <td class="incomplete-cell"></td>
          <td class="incomplete-cell"></td>
          <td>9876543210</td>
          <td class="incomplete-cell"></td>
          <td>2023-06-01</td>
          <td class="incomplete-cell"></td>
          <td><button class="btn btn-sm btn-primary edit-btn">Edit</button></td>
        </tr>
        <tr>
          <td class="sticky-col">2</td>
          <td class="sticky-col-2">Kumar Pvt Ltd</td>
          <td>27ABCDE1234F1Z5</td>
          <td>Retail</td>
          <td>Telangana</td>
          <td>Hyderabad</td>
          <td>500081</td>
          <td>info@kumar.com</td>
          <td>9900112233</td>
          <td>50L</td>
          <td>2022-01-01</td>
          <td>Regular</td>
          <td><button class="btn btn-sm btn-primary edit-btn">Edit</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</div><!-- Side Edit Panel --><div id="editPanel" class="edit-panel">
  <h4>Edit Missing Fields</h4>
  <form id="editForm">
    <div class="mb-3">
      <label for="gstNumber" class="form-label">GST Number</label>
      <input type="text" class="form-control" id="gstNumber" name="gstNumber">
    </div>
    <div class="mb-3">
      <label for="businessType" class="form-label">Business Type</label>
      <input type="text" class="form-control" id="businessType" name="businessType">
    </div>
    <div class="mb-3">
      <label for="pincode" class="form-label">Pincode</label>
      <input type="text" class="form-control" id="pincode" name="pincode">
    </div>
    <div class="mb-3">
      <label for="email" class="form-label">Email</label>
      <input type="email" class="form-control" id="email" name="email">
    </div>
    <div class="mb-3">
      <label for="turnover" class="form-label">Turnover</label>
      <input type="text" class="form-control" id="turnover" name="turnover">
    </div>
    <div class="mb-3">
      <label for="category" class="form-label">Category</label>
      <input type="text" class="form-control" id="category" name="category">
    </div>
    <div class="progress-msg mb-2">0 of 6 fields completed</div>
    <button type="submit" class="btn btn-success">Save</button>
    <button type="button" class="btn btn-secondary ms-2" onclick="closePanel()">Cancel</button>
  </form>
</div><script>
  const panel = document.getElementById('editPanel');
  const editButtons = document.querySelectorAll('.edit-btn');
  const form = document.getElementById('editForm');
  const progressMsg = document.querySelector('.progress-msg');

  editButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      openPanel();
      form.reset();
      updateProgress();
    });
  });

  form.addEventListener('input', updateProgress);

  function updateProgress() {
    const fields = form.querySelectorAll('input');
    const filled = Array.from(fields).filter(f => f.value.trim() !== '').length;
    progressMsg.textContent = `${filled} of ${fields.length} fields completed`;
  }

  function openPanel() {
    panel.classList.add('open');
  }

  function closePanel() {
    panel.classList.remove('open');
  }
</script></body>
</html>