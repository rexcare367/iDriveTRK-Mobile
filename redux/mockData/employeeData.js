// Mock Employee Data for Testing
export const mockEmployees = [
  {
    id: "emp_001",
    name: "Stephen Obarido",
    email: "stephen.obarido@company.com",
    department: "Engineering",
    position: "Senior Developer",
    hourlyRate: 25.0,
    employeeId: "EMP001",
    hireDate: "2023-03-15",
    manager: "John Smith",
    avatar: "https://via.placeholder.com/40x40/4CAF50/FFFFFF?text=SO",
    status: "active",
    permissions: ["timesheet", "payroll_submit"]
  },
  {
    id: "emp_002",
    name: "Jane Smith",
    email: "jane.smith@company.com",
    department: "Marketing",
    position: "Marketing Manager",
    hourlyRate: 28.0,
    employeeId: "EMP002",
    hireDate: "2022-08-20",
    manager: "Sarah Johnson",
    avatar: "https://via.placeholder.com/40x40/2196F3/FFFFFF?text=JS",
    status: "active",
    permissions: ["timesheet", "payroll_submit", "team_view"]
  },
  {
    id: "emp_003",
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    department: "Operations",
    position: "Operations Specialist",
    hourlyRate: 22.0,
    employeeId: "EMP003",
    hireDate: "2023-01-10",
    manager: "David Wilson",
    avatar: "https://via.placeholder.com/40x40/FF9800/FFFFFF?text=MJ",
    status: "active",
    permissions: ["timesheet", "payroll_submit"]
  },
  {
    id: "emp_004",
    name: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    department: "IT",
    position: "System Administrator",
    hourlyRate: 30.0,
    employeeId: "EMP004",
    hireDate: "2021-11-05",
    manager: "Robert Brown",
    avatar: "https://via.placeholder.com/40x40/9C27B0/FFFFFF?text=SW",
    status: "active",
    permissions: ["timesheet", "payroll_submit", "admin"]
  },
  {
    id: "emp_005",
    name: "David Brown",
    email: "david.brown@company.com",
    department: "Sales",
    position: "Sales Representative",
    hourlyRate: 20.0,
    employeeId: "EMP005",
    hireDate: "2023-06-12",
    manager: "Lisa Garcia",
    avatar: "https://via.placeholder.com/40x40/795548/FFFFFF?text=DB",
    status: "active",
    permissions: ["timesheet", "payroll_submit"]
  },
  {
    id: "emp_006",
    name: "Lisa Garcia",
    email: "lisa.garcia@company.com",
    department: "HR",
    position: "HR Coordinator",
    hourlyRate: 24.0,
    employeeId: "EMP006",
    hireDate: "2022-04-18",
    manager: "Emily Davis",
    avatar: "https://via.placeholder.com/40x40/E91E63/FFFFFF?text=LG",
    status: "active",
    permissions: ["timesheet", "payroll_submit", "hr_admin"]
  },
  {
    id: "emp_007",
    name: "Robert Taylor",
    email: "robert.taylor@company.com",
    department: "Finance",
    position: "Financial Analyst",
    hourlyRate: 26.0,
    employeeId: "EMP007",
    hireDate: "2022-09-30",
    manager: "Michael Chen",
    avatar: "https://via.placeholder.com/40x40/607D8B/FFFFFF?text=RT",
    status: "active",
    permissions: ["timesheet", "payroll_submit", "finance_view"]
  },
  {
    id: "emp_008",
    name: "Emily Davis",
    email: "emily.davis@company.com",
    department: "Customer Service",
    position: "Customer Service Rep",
    hourlyRate: 18.0,
    employeeId: "EMP008",
    hireDate: "2023-02-14",
    manager: "Jennifer Wilson",
    avatar: "https://via.placeholder.com/40x40/00BCD4/FFFFFF?text=ED",
    status: "active",
    permissions: ["timesheet", "payroll_submit"]
  }
];

export const mockManagers = [
  {
    id: "mgr_001",
    name: "John Smith",
    email: "john.smith@company.com",
    department: "Engineering",
    position: "Engineering Manager",
    employeeId: "MGR001",
    avatar: "https://via.placeholder.com/40x40/3F51B5/FFFFFF?text=JS",
    permissions: [
      "timesheet",
      "payroll_submit",
      "payroll_approve",
      "team_manage"
    ],
    directReports: ["emp_001"]
  },
  {
    id: "mgr_002",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    department: "Marketing",
    position: "Marketing Director",
    employeeId: "MGR002",
    avatar: "https://via.placeholder.com/40x40/8BC34A/FFFFFF?text=SJ",
    permissions: [
      "timesheet",
      "payroll_submit",
      "payroll_approve",
      "team_manage"
    ],
    directReports: ["emp_002"]
  },
  {
    id: "mgr_003",
    name: "Operations Manager",
    email: "ops.manager@company.com",
    department: "Operations",
    position: "Operations Manager",
    employeeId: "MGR003",
    avatar: "https://via.placeholder.com/40x40/FF5722/FFFFFF?text=OM",
    permissions: [
      "timesheet",
      "payroll_submit",
      "payroll_approve",
      "payroll_admin",
      "export"
    ],
    directReports: [
      "emp_003",
      "emp_004",
      "emp_005",
      "emp_006",
      "emp_007",
      "emp_008"
    ]
  }
];

export const mockDepartments = [
  {
    id: "dept_001",
    name: "Engineering",
    manager: "mgr_001",
    employees: ["emp_001"],
    budget: 150000
  },
  {
    id: "dept_002",
    name: "Marketing",
    manager: "mgr_002",
    employees: ["emp_002"],
    budget: 120000
  },
  {
    id: "dept_003",
    name: "Operations",
    manager: "mgr_003",
    employees: ["emp_003"],
    budget: 100000
  },
  {
    id: "dept_004",
    name: "IT",
    manager: "mgr_003",
    employees: ["emp_004"],
    budget: 180000
  },
  {
    id: "dept_005",
    name: "Sales",
    manager: "mgr_003",
    employees: ["emp_005"],
    budget: 90000
  },
  {
    id: "dept_006",
    name: "HR",
    manager: "mgr_003",
    employees: ["emp_006"],
    budget: 80000
  },
  {
    id: "dept_007",
    name: "Finance",
    manager: "mgr_003",
    employees: ["emp_007"],
    budget: 110000
  },
  {
    id: "dept_008",
    name: "Customer Service",
    manager: "mgr_003",
    employees: ["emp_008"],
    budget: 70000
  }
];

export const mockPayrollPeriods = [
  {
    id: "pp_001",
    startDate: "2024-12-16T00:00:00.000Z",
    endDate: "2024-12-29T23:59:59.999Z",
    status: "current",
    cutoffDate: "2024-12-30T23:59:59.999Z",
    payDate: "2025-01-10T00:00:00.000Z"
  },
  {
    id: "pp_002",
    startDate: "2024-12-02T00:00:00.000Z",
    endDate: "2024-12-15T23:59:59.999Z",
    status: "processed",
    cutoffDate: "2024-12-16T23:59:59.999Z",
    payDate: "2024-12-27T00:00:00.000Z"
  },
  {
    id: "pp_003",
    startDate: "2024-11-18T00:00:00.000Z",
    endDate: "2024-12-01T23:59:59.999Z",
    status: "processed",
    cutoffDate: "2024-12-02T23:59:59.999Z",
    payDate: "2024-12-13T00:00:00.000Z"
  }
];

// Helper function to get employee by ID
export const getEmployeeById = (id) => {
  return mockEmployees.find((emp) => emp.id === id) || mockEmployees[0];
};

// Helper function to get manager by ID
export const getManagerById = (id) => {
  return mockManagers.find((mgr) => mgr.id === id);
};

// Helper function to get current user (for demo purposes)
export const getCurrentUser = () => {
  return {
    ...mockEmployees[0], // Stephen Obarido as default user
    isManager: false,
    permissions: ["timesheet", "payroll_submit"]
  };
};

// Helper function to get admin user
export const getAdminUser = () => {
  return {
    ...mockManagers[2], // Operations Manager
    isManager: true,
    isAdmin: true,
    permissions: [
      "timesheet",
      "payroll_submit",
      "payroll_approve",
      "payroll_admin",
      "export"
    ]
  };
};
