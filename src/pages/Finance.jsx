import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { PlusCircle, FileText, Download, Search, Edit, Trash2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

// LocalStorage utilities
const LS_KEY_TRANSACTIONS = 'transactions';
const LS_KEY_PROJECTS = 'projects';

export function getTransactionsFromLocalStorage() {
  try {
    const data = localStorage.getItem(LS_KEY_TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveTransactionsToLocalStorage(transactions) {
  localStorage.setItem(LS_KEY_TRANSACTIONS, JSON.stringify(transactions));
}

export function getProjectsFromLocalStorage() {
  try {
    const data = localStorage.getItem(LS_KEY_PROJECTS);
    return data ? JSON.parse(data) : [
      { id: 'project-1', name: 'Default Project' },
      { id: 'project-2', name: 'Sample Project' }
    ];
  } catch {
    return [{ id: 'project-1', name: 'Default Project' }];
  }
}

export function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// Transaction Form Dialog Component
const TransactionFormDialog = ({ isOpen, onClose, mode = 'add', transactionData, onSave }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    projectId: '',
  });
  
  const [projects] = useState(getProjectsFromLocalStorage());
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && transactionData) {
        setFormData({
          ...transactionData,
          amount: transactionData.amount?.toString() || '',
        });
      } else {
        setFormData({
          type: 'expense',
          category: '',
          amount: '',
          date: new Date().toISOString().split('T')[0],
          description: '',
          projectId: projects[0]?.id || '',
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, transactionData, projects]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.projectId) newErrors.projectId = 'Project is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const transactionPayload = {
      ...formData,
      amount: parseFloat(formData.amount),
    };

    if (mode === 'add') {
      transactionPayload.id = generateId();
    } else {
      transactionPayload.id = transactionData.id;
    }

    onSave(transactionPayload, mode);
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add Transaction' : 'Edit Transaction'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add' ? 'Add a new financial transaction' : 'Update transaction details'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <div className="text-red-500 text-xs mt-1">{errors.type}</div>}
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder={formData.type === 'income' ? 'e.g., Salary' : 'e.g., Office Supplies'}
              />
              {errors.category && <div className="text-red-500 text-xs mt-1">{errors.category}</div>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount (DZD)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {errors.amount && <div className="text-red-500 text-xs mt-1">{errors.amount}</div>}
            </div>
            
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
              />
              {errors.date && <div className="text-red-500 text-xs mt-1">{errors.date}</div>}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter transaction description"
            />
            {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
          </div>

          <div>
            <Label htmlFor="project">Project</Label>
            <Select value={formData.projectId} onValueChange={(value) => handleSelectChange('projectId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.projectId && <div className="text-red-500 text-xs mt-1">{errors.projectId}</div>}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {mode === 'add' ? 'Add Transaction' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Delete Confirmation Dialog
const DeleteDialog = ({ isOpen, onClose, onConfirm, transactionName }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Transaction</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{transactionName}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Summary Cards Component
const SummaryCards = ({ totalIncome, totalExpenses, balance }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="flex items-center p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Income</p>
              <p className="text-2xl font-bold text-green-600">{totalIncome.toFixed(2)} DZD</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex items-center p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-red-100 rounded-full">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">{totalExpenses.toFixed(2)} DZD</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex items-center p-6">
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-full ${balance >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
              <DollarSign className={`h-6 w-6 ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Balance</p>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                {balance.toFixed(2)} DZD
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Transaction List Component
const TransactionList = ({ transactions, projects, onEdit, onDelete }) => {
  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-2">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`} />
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-muted-foreground">
                  {transaction.category} • {getProjectName(transaction.projectId)} • {formatDate(transaction.date)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
              {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toFixed(2)} DZD
            </span>
            
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(transaction)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(transaction)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Main Finance Component
const Finance = () => {
  const [transactions, setTransactions] = useState([]);
  const [projects] = useState(getProjectsFromLocalStorage());
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [formMode, setFormMode] = useState('add');

  // Load transactions from localStorage on component mount
  useEffect(() => {
    const savedTransactions = getTransactionsFromLocalStorage();
    setTransactions(savedTransactions);
  }, []);

  // Filter transactions based on active tab and search term
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = !searchTerm || 
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = activeTab === 'all' || transaction.type === activeTab;
      
      return matchesSearch && matchesType;
    });
  }, [transactions, searchTerm, activeTab]);

  // Calculate summary statistics
  const totalIncome = useMemo(() => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const balance = totalIncome - totalExpenses;

  // Handle saving transactions
  const handleSaveTransaction = (transactionData, mode) => {
    let updatedTransactions;
    
    if (mode === 'add') {
      updatedTransactions = [...transactions, transactionData];
    } else {
      updatedTransactions = transactions.map(t => 
        t.id === transactionData.id ? transactionData : t
      );
    }
    
    setTransactions(updatedTransactions);
    saveTransactionsToLocalStorage(updatedTransactions);
  };

  // Handle deleting transactions
  const handleDeleteTransaction = () => {
    if (currentTransaction) {
      const updatedTransactions = transactions.filter(t => t.id !== currentTransaction.id);
      setTransactions(updatedTransactions);
      saveTransactionsToLocalStorage(updatedTransactions);
    }
    setIsDeleteDialogOpen(false);
    setCurrentTransaction(null);
  };

  const openFormDialog = (mode, transaction = null) => {
    setFormMode(mode);
    setCurrentTransaction(transaction);
    setIsFormDialogOpen(true);
  };

  const openDeleteDialog = (transaction) => {
    setCurrentTransaction(transaction);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance Overview</h1>
          <p className="text-muted-foreground">Track your project transactions and financial status in DZD.</p>
        </div>
        <Button
          onClick={() => openFormDialog('add')}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      {/* Summary Cards */}
      <SummaryCards 
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        balance={balance}
      />

      {/* Transactions Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>Transactions</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-9 w-[200px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All ({transactions.length})</TabsTrigger>
              <TabsTrigger value="income">Income ({transactions.filter(t => t.type === 'income').length})</TabsTrigger>
              <TabsTrigger value="expense">Expenses ({transactions.filter(t => t.type === 'expense').length})</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="h-10 w-10 text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium">No transactions found</h3>
              <p className="text-muted-foreground mt-1">
                {searchTerm || activeTab !== 'all'
                  ? 'Try adjusting your search or filters.'
                  : 'Add a new transaction to get started.'}
              </p>
            </div>
          ) : (
            <TransactionList
              transactions={filteredTransactions}
              projects={projects}
              onEdit={(transaction) => openFormDialog('edit', transaction)}
              onDelete={openDeleteDialog}
            />
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <TransactionFormDialog
        isOpen={isFormDialogOpen}
        onClose={() => setIsFormDialogOpen(false)}
        mode={formMode}
        transactionData={currentTransaction}
        onSave={handleSaveTransaction}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteTransaction}
        transactionName={currentTransaction?.description}
      />
    </div>
  );
};

export default Finance;