import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface StageExpense {
  id: string;
  description: string;
  amount: number;
  type: 'materials' | 'labor';
  date: string;
}

interface WorkStage {
  id: string;
  name: string;
  progress: number;
  status: 'pending' | 'in-progress' | 'completed';
  budget: number;
  spent: number;
  expenses: StageExpense[];
}

interface Site {
  id: string;
  name: string;
  address: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  stages: WorkStage[];
}

interface Transaction {
  id: string;
  siteId: string;
  stageId?: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  category: string;
}

const Index = () => {
  const [sites, setSites] = useState<Site[]>([
    { 
      id: '1', 
      name: 'ЖК Солнечный', 
      address: 'ул. Ленина, 45', 
      totalIncome: 1500000, 
      totalExpense: 850000, 
      balance: 650000,
      stages: [
        { id: 's1', name: 'Фундамент', progress: 100, status: 'completed', budget: 300000, spent: 280000, expenses: [
          { id: 'e1', description: 'Бетон и арматура', amount: 120000, type: 'materials', date: '2025-01-10' },
          { id: 'e2', description: 'Работа бригады', amount: 160000, type: 'labor', date: '2025-01-15' },
        ]},
        { id: 's2', name: 'Стены', progress: 65, status: 'in-progress', budget: 500000, spent: 320000, expenses: [
          { id: 'e3', description: 'Кирпич', amount: 200000, type: 'materials', date: '2025-01-20' },
          { id: 'e4', description: 'Кладка стен', amount: 120000, type: 'labor', date: '2025-01-25' },
        ]},
        { id: 's3', name: 'Кровля', progress: 0, status: 'pending', budget: 250000, spent: 0, expenses: [] },
      ]
    },
    { 
      id: '2', 
      name: 'Коттедж на Озерной', 
      address: 'пос. Заречье, уч. 12', 
      totalIncome: 800000, 
      totalExpense: 620000, 
      balance: 180000,
      stages: [
        { id: 's4', name: 'Земляные работы', progress: 100, status: 'completed', budget: 150000, spent: 145000, expenses: [
          { id: 'e5', description: 'Аренда экскаватора', amount: 45000, type: 'labor', date: '2025-01-05' },
          { id: 'e6', description: 'Вывоз грунта', amount: 100000, type: 'labor', date: '2025-01-08' },
        ]},
        { id: 's5', name: 'Фундамент', progress: 40, status: 'in-progress', budget: 400000, spent: 160000, expenses: [
          { id: 'e7', description: 'Бетон М300', amount: 80000, type: 'materials', date: '2025-01-12' },
          { id: 'e8', description: 'Арматура', amount: 50000, type: 'materials', date: '2025-01-14' },
          { id: 'e9', description: 'Заливка фундамента', amount: 30000, type: 'labor', date: '2025-01-16' },
        ]},
      ]
    },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', siteId: '1', stageId: 's1', type: 'expense', amount: 280000, description: 'Работы по фундаменту', date: '2025-01-15', category: 'Фундамент' },
    { id: '2', siteId: '1', stageId: 's2', type: 'expense', amount: 150000, description: 'Закупка кирпича', date: '2025-01-16', category: 'Материалы' },
    { id: '3', siteId: '2', type: 'income', amount: 300000, description: 'Аванс', date: '2025-01-17', category: 'Платеж заказчика' },
  ]);

  const [selectedSite, setSelectedSite] = useState<string>('all');
  const [viewingSite, setViewingSite] = useState<Site | null>(null);
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteAddress, setNewSiteAddress] = useState('');
  const [newTransactionSite, setNewTransactionSite] = useState('');
  const [newTransactionStage, setNewTransactionStage] = useState('');
  const [newTransactionType, setNewTransactionType] = useState<'income' | 'expense'>('income');
  const [newTransactionAmount, setNewTransactionAmount] = useState('');
  const [newTransactionDescription, setNewTransactionDescription] = useState('');
  const [newTransactionCategory, setNewTransactionCategory] = useState('');
  const [newStageName, setNewStageName] = useState('');
  const [newStageBudget, setNewStageBudget] = useState('');
  const [editingStageId, setEditingStageId] = useState('');
  const [editStageProgress, setEditStageProgress] = useState('');
  const [viewingStageExpenses, setViewingStageExpenses] = useState<{siteId: string; stage: WorkStage} | null>(null);
  const [newExpenseDescription, setNewExpenseDescription] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseType, setNewExpenseType] = useState<'materials' | 'labor'>('materials');

  const addSite = () => {
    if (newSiteName && newSiteAddress) {
      const newSite: Site = {
        id: Date.now().toString(),
        name: newSiteName,
        address: newSiteAddress,
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        stages: [],
      };
      setSites([...sites, newSite]);
      setNewSiteName('');
      setNewSiteAddress('');
    }
  };

  const addStageToSite = (siteId: string) => {
    if (newStageName && newStageBudget) {
      setSites(sites.map(site => {
        if (site.id === siteId) {
          const newStage: WorkStage = {
            id: `stage_${Date.now()}`,
            name: newStageName,
            progress: 0,
            status: 'pending',
            budget: parseFloat(newStageBudget),
            spent: 0,
            expenses: [],
          };
          return { ...site, stages: [...site.stages, newStage] };
        }
        return site;
      }));
      setNewStageName('');
      setNewStageBudget('');
    }
  };

  const addExpenseToStage = (siteId: string, stageId: string) => {
    if (newExpenseDescription && newExpenseAmount) {
      const amount = parseFloat(newExpenseAmount);
      setSites(sites.map(site => {
        if (site.id === siteId) {
          return {
            ...site,
            totalExpense: site.totalExpense + amount,
            balance: site.totalIncome - (site.totalExpense + amount),
            stages: site.stages.map(stage => {
              if (stage.id === stageId) {
                const newExpense: StageExpense = {
                  id: `exp_${Date.now()}`,
                  description: newExpenseDescription,
                  amount,
                  type: newExpenseType,
                  date: new Date().toISOString().split('T')[0],
                };
                return {
                  ...stage,
                  spent: stage.spent + amount,
                  expenses: [...stage.expenses, newExpense],
                };
              }
              return stage;
            }),
          };
        }
        return site;
      }));
      setNewExpenseDescription('');
      setNewExpenseAmount('');
      setNewExpenseType('materials');
    }
  };

  const deleteExpense = (siteId: string, stageId: string, expenseId: string) => {
    setSites(sites.map(site => {
      if (site.id === siteId) {
        const stage = site.stages.find(s => s.id === stageId);
        const expense = stage?.expenses.find(e => e.id === expenseId);
        if (expense) {
          return {
            ...site,
            totalExpense: site.totalExpense - expense.amount,
            balance: site.totalIncome - (site.totalExpense - expense.amount),
            stages: site.stages.map(s => {
              if (s.id === stageId) {
                return {
                  ...s,
                  spent: s.spent - expense.amount,
                  expenses: s.expenses.filter(e => e.id !== expenseId),
                };
              }
              return s;
            }),
          };
        }
      }
      return site;
    }));
  };

  const updateStageProgress = (siteId: string, stageId: string, progress: number) => {
    setSites(sites.map(site => {
      if (site.id === siteId) {
        return {
          ...site,
          stages: site.stages.map(stage => {
            if (stage.id === stageId) {
              let status: 'pending' | 'in-progress' | 'completed' = 'pending';
              if (progress === 100) status = 'completed';
              else if (progress > 0) status = 'in-progress';
              return { ...stage, progress, status };
            }
            return stage;
          })
        };
      }
      return site;
    }));
    setEditingStageId('');
    setEditStageProgress('');
  };

  const deleteStage = (siteId: string, stageId: string) => {
    setSites(sites.map(site => {
      if (site.id === siteId) {
        return {
          ...site,
          stages: site.stages.filter(stage => stage.id !== stageId)
        };
      }
      return site;
    }));
  };

  const addTransaction = () => {
    if (newTransactionSite && newTransactionAmount && newTransactionDescription && newTransactionCategory) {
      const amount = parseFloat(newTransactionAmount);
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        siteId: newTransactionSite,
        stageId: newTransactionStage || undefined,
        type: newTransactionType,
        amount,
        description: newTransactionDescription,
        date: new Date().toISOString().split('T')[0],
        category: newTransactionCategory,
      };
      
      setTransactions([...transactions, newTransaction]);
      
      setSites(sites.map(site => {
        if (site.id === newTransactionSite) {
          const newIncome = newTransactionType === 'income' ? site.totalIncome + amount : site.totalIncome;
          const newExpense = newTransactionType === 'expense' ? site.totalExpense + amount : site.totalExpense;
          
          let updatedStages = site.stages;
          if (newTransactionStage && newTransactionType === 'expense') {
            updatedStages = site.stages.map(stage => {
              if (stage.id === newTransactionStage) {
                return { ...stage, spent: stage.spent + amount };
              }
              return stage;
            });
          }
          
          return {
            ...site,
            totalIncome: newIncome,
            totalExpense: newExpense,
            balance: newIncome - newExpense,
            stages: updatedStages,
          };
        }
        return site;
      }));
      
      setNewTransactionSite('');
      setNewTransactionStage('');
      setNewTransactionAmount('');
      setNewTransactionDescription('');
      setNewTransactionCategory('');
    }
  };

  const totalIncome = sites.reduce((sum, site) => sum + site.totalIncome, 0);
  const totalExpense = sites.reduce((sum, site) => sum + site.totalExpense, 0);
  const totalBalance = totalIncome - totalExpense;

  const filteredTransactions = selectedSite === 'all' 
    ? transactions 
    : transactions.filter(t => t.siteId === selectedSite);

  const chartData = sites.map(site => ({
    name: site.name,
    доходы: site.totalIncome,
    расходы: site.totalExpense,
    прибыль: site.balance,
  }));

  const pieData = [
    { name: 'Доходы', value: totalIncome, color: '#10B981' },
    { name: 'Расходы', value: totalExpense, color: '#F97316' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success text-white';
      case 'in-progress': return 'bg-primary text-white';
      case 'pending': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Завершено';
      case 'in-progress': return 'В работе';
      case 'pending': return 'Ожидание';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="Building2" className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">СтройКонтроль</h1>
                <p className="text-sm text-muted-foreground">Управление строительными объектами</p>
              </div>
            </div>
            <nav className="hidden md:flex gap-6">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Главная
              </Button>
              <Button variant="ghost" className="text-foreground hover:text-primary">
                О нас
              </Button>
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Контакты
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 mb-8 md:grid-cols-3 animate-fade-in">
          <Card className="bg-card border-border hover:border-primary transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Общие доходы</CardTitle>
              <Icon name="TrendingUp" className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{totalIncome.toLocaleString()} ₽</div>
              <p className="text-xs text-muted-foreground mt-1">По всем объектам</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-primary transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Общие расходы</CardTitle>
              <Icon name="TrendingDown" className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{totalExpense.toLocaleString()} ₽</div>
              <p className="text-xs text-muted-foreground mt-1">По всем объектам</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-primary transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Прибыль</CardTitle>
              <Icon name="Wallet" className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalBalance.toLocaleString()} ₽</div>
              <p className="text-xs text-muted-foreground mt-1">Общий баланс</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 mb-8 lg:grid-cols-2">
          <Card className="bg-card border-border animate-scale-in">
            <CardHeader>
              <CardTitle>Статистика по объектам</CardTitle>
              <CardDescription>Сравнение доходов и расходов</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="доходы" fill="#10B981" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="расходы" fill="#F97316" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-card border-border animate-scale-in">
            <CardHeader>
              <CardTitle>Общее распределение</CardTitle>
              <CardDescription>Доходы vs Расходы</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sites" className="animate-fade-in">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="sites">Объекты</TabsTrigger>
            <TabsTrigger value="transactions">Транзакции</TabsTrigger>
          </TabsList>

          <TabsContent value="sites" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Строительные объекты</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Icon name="Plus" className="h-4 w-4 mr-2" />
                    Добавить объект
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card">
                  <DialogHeader>
                    <DialogTitle>Новый объект</DialogTitle>
                    <DialogDescription>Добавьте информацию о новом строительном объекте</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="site-name">Название</Label>
                      <Input
                        id="site-name"
                        value={newSiteName}
                        onChange={(e) => setNewSiteName(e.target.value)}
                        placeholder="ЖК Центральный"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="site-address">Адрес</Label>
                      <Input
                        id="site-address"
                        value={newSiteAddress}
                        onChange={(e) => setNewSiteAddress(e.target.value)}
                        placeholder="ул. Строителей, 10"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={addSite} className="bg-primary hover:bg-primary/90">Добавить</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sites.map((site) => (
                <Card key={site.id} className="bg-card border-border hover:border-primary transition-all hover:scale-105 cursor-pointer" onClick={() => setViewingSite(site)}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Building2" className="h-5 w-5 text-primary" />
                      {site.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Icon name="MapPin" className="h-3 w-3" />
                      {site.address}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Доходы:</span>
                      <span className="font-semibold text-success">{site.totalIncome.toLocaleString()} ₽</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Расходы:</span>
                      <span className="font-semibold text-destructive">{site.totalExpense.toLocaleString()} ₽</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-border">
                      <span className="text-sm font-medium">Баланс:</span>
                      <span className="font-bold text-primary">{site.balance.toLocaleString()} ₽</span>
                    </div>
                    {site.stages.length > 0 && (
                      <div className="pt-2 border-t border-border">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">Этапы работ:</span>
                          <span className="text-xs font-medium">{site.stages.filter(s => s.status === 'completed').length}/{site.stages.length}</span>
                        </div>
                        <Progress value={(site.stages.filter(s => s.status === 'completed').length / site.stages.length) * 100} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="mt-6">
            <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <Label>Фильтр по объекту:</Label>
                <Select value={selectedSite} onValueChange={setSelectedSite}>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все объекты</SelectItem>
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Icon name="Plus" className="h-4 w-4 mr-2" />
                    Добавить транзакцию
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card">
                  <DialogHeader>
                    <DialogTitle>Новая транзакция</DialogTitle>
                    <DialogDescription>Запишите доход или расход по объекту</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="trans-site">Объект</Label>
                      <Select value={newTransactionSite} onValueChange={setNewTransactionSite}>
                        <SelectTrigger id="trans-site">
                          <SelectValue placeholder="Выберите объект" />
                        </SelectTrigger>
                        <SelectContent>
                          {sites.map((site) => (
                            <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {newTransactionSite && sites.find(s => s.id === newTransactionSite)?.stages.length > 0 && (
                      <div className="grid gap-2">
                        <Label htmlFor="trans-stage">Этап работ (опционально)</Label>
                        <Select value={newTransactionStage} onValueChange={setNewTransactionStage}>
                          <SelectTrigger id="trans-stage">
                            <SelectValue placeholder="Выберите этап" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Не привязывать к этапу</SelectItem>
                            {sites.find(s => s.id === newTransactionSite)?.stages.map((stage) => (
                              <SelectItem key={stage.id} value={stage.id}>{stage.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className="grid gap-2">
                      <Label htmlFor="trans-type">Тип</Label>
                      <Select value={newTransactionType} onValueChange={(v) => setNewTransactionType(v as 'income' | 'expense')}>
                        <SelectTrigger id="trans-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income">Доход</SelectItem>
                          <SelectItem value="expense">Расход</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="trans-amount">Сумма</Label>
                      <Input
                        id="trans-amount"
                        type="number"
                        value={newTransactionAmount}
                        onChange={(e) => setNewTransactionAmount(e.target.value)}
                        placeholder="50000"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="trans-category">Категория</Label>
                      <Input
                        id="trans-category"
                        value={newTransactionCategory}
                        onChange={(e) => setNewTransactionCategory(e.target.value)}
                        placeholder="Материалы, Зарплата и т.д."
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="trans-desc">Описание</Label>
                      <Input
                        id="trans-desc"
                        value={newTransactionDescription}
                        onChange={(e) => setNewTransactionDescription(e.target.value)}
                        placeholder="Описание транзакции"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={addTransaction} className="bg-primary hover:bg-primary/90">Добавить</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>История транзакций</CardTitle>
                <CardDescription>Все доходы и расходы по объектам</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTransactions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Нет транзакций</p>
                  ) : (
                    filteredTransactions.map((transaction) => {
                      const site = sites.find(s => s.id === transaction.siteId);
                      const stage = transaction.stageId ? site?.stages.find(st => st.id === transaction.stageId) : null;
                      return (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${transaction.type === 'income' ? 'bg-success/20' : 'bg-destructive/20'}`}>
                              <Icon 
                                name={transaction.type === 'income' ? 'ArrowUpRight' : 'ArrowDownRight'} 
                                className={`h-5 w-5 ${transaction.type === 'income' ? 'text-success' : 'text-destructive'}`}
                              />
                            </div>
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <p className="text-sm text-muted-foreground">
                                {site?.name} {stage && `• ${stage.name}`} • {transaction.category}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold text-lg ${transaction.type === 'income' ? 'text-success' : 'text-destructive'}`}>
                              {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString()} ₽
                            </p>
                            <p className="text-sm text-muted-foreground">{transaction.date}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={viewingSite !== null} onOpenChange={(open) => !open && setViewingSite(null)}>
        <DialogContent className="bg-card max-w-3xl max-h-[90vh] overflow-y-auto">
          {viewingSite && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Icon name="Building2" className="h-6 w-6 text-primary" />
                  {viewingSite.name}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-1">
                  <Icon name="MapPin" className="h-4 w-4" />
                  {viewingSite.address}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Доходы</p>
                    <p className="text-xl font-bold text-success">{viewingSite.totalIncome.toLocaleString()} ₽</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Расходы</p>
                    <p className="text-xl font-bold text-destructive">{viewingSite.totalExpense.toLocaleString()} ₽</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Баланс</p>
                    <p className="text-xl font-bold text-primary">{viewingSite.balance.toLocaleString()} ₽</p>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Этапы работ</h3>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          <Icon name="Plus" className="h-4 w-4 mr-1" />
                          Добавить этап
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-card">
                        <DialogHeader>
                          <DialogTitle>Новый этап работ</DialogTitle>
                          <DialogDescription>Добавьте этап строительства для объекта</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="stage-name">Название этапа</Label>
                            <Input
                              id="stage-name"
                              value={newStageName}
                              onChange={(e) => setNewStageName(e.target.value)}
                              placeholder="Например: Фундамент, Кровля..."
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="stage-budget">Бюджет этапа</Label>
                            <Input
                              id="stage-budget"
                              type="number"
                              value={newStageBudget}
                              onChange={(e) => setNewStageBudget(e.target.value)}
                              placeholder="500000"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={() => addStageToSite(viewingSite.id)} className="bg-primary hover:bg-primary/90">
                            Добавить
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {viewingSite.stages.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Нет этапов. Добавьте первый этап работ.</p>
                  ) : (
                    <div className="space-y-3">
                      {viewingSite.stages.map((stage) => (
                        <Card key={stage.id} className="bg-card/50 border-border">
                          <CardContent className="pt-4">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-semibold">{stage.name}</h4>
                                    <Badge className={getStatusColor(stage.status)}>
                                      {getStatusText(stage.status)}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span>Бюджет: {stage.budget.toLocaleString()} ₽</span>
                                    <span>Потрачено: {stage.spent.toLocaleString()} ₽</span>
                                    <span className={stage.spent > stage.budget ? 'text-destructive font-medium' : ''}>
                                      Остаток: {(stage.budget - stage.spent).toLocaleString()} ₽
                                    </span>
                                  </div>
                                  {stage.expenses.length > 0 && (
                                    <div className="flex items-center gap-2 text-sm mt-1">
                                      <span className="text-success">Материалы: {stage.expenses.filter(e => e.type === 'materials').reduce((sum, e) => sum + e.amount, 0).toLocaleString()} ₽</span>
                                      <span className="text-muted-foreground">•</span>
                                      <span className="text-primary">Работы: {stage.expenses.filter(e => e.type === 'labor').reduce((sum, e) => sum + e.amount, 0).toLocaleString()} ₽</span>
                                    </div>
                                  )}
                                  <Button 
                                    size="sm" 
                                    variant="link" 
                                    className="h-auto p-0 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setViewingStageExpenses({ siteId: viewingSite.id, stage });
                                    }}
                                  >
                                    <Icon name="FileText" className="h-3 w-3 mr-1" />
                                    Детализация расходов ({stage.expenses.length})
                                  </Button>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={(e) => {
                                    e.stopPropagation();
                                    setViewingStageExpenses({ siteId: viewingSite.id, stage });
                                  }}>
                                    <Icon name="Plus" className="h-3 w-3 mr-1" />
                                    Расход
                                  </Button>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button size="sm" variant="outline" onClick={() => {
                                        setEditingStageId(stage.id);
                                        setEditStageProgress(stage.progress.toString());
                                      }}>
                                        <Icon name="Edit" className="h-3 w-3" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-card">
                                      <DialogHeader>
                                        <DialogTitle>Обновить прогресс</DialogTitle>
                                        <DialogDescription>Укажите процент выполнения этапа "{stage.name}"</DialogDescription>
                                      </DialogHeader>
                                      <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                          <Label htmlFor="stage-progress">Прогресс (%)</Label>
                                          <Input
                                            id="stage-progress"
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={editStageProgress}
                                            onChange={(e) => setEditStageProgress(e.target.value)}
                                            placeholder="0-100"
                                          />
                                        </div>
                                      </div>
                                      <DialogFooter>
                                        <Button onClick={() => {
                                          const progress = parseInt(editStageProgress);
                                          if (progress >= 0 && progress <= 100) {
                                            updateStageProgress(viewingSite.id, stage.id, progress);
                                          }
                                        }} className="bg-primary hover:bg-primary/90">
                                          Обновить
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="hover:bg-destructive hover:text-white"
                                    onClick={() => deleteStage(viewingSite.id, stage.id)}
                                  >
                                    <Icon name="Trash2" className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>Прогресс</span>
                                  <span>{stage.progress}%</span>
                                </div>
                                <Progress value={stage.progress} className="h-2" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={viewingStageExpenses !== null} onOpenChange={(open) => !open && setViewingStageExpenses(null)}>
        <DialogContent className="bg-card max-w-2xl max-h-[90vh] overflow-y-auto">
          {viewingStageExpenses && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Icon name="Receipt" className="h-5 w-5 text-primary" />
                  Детализация расходов: {viewingStageExpenses.stage.name}
                </DialogTitle>
                <DialogDescription>
                  Учет материалов и работ по этапу
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="bg-success/10 border-success/30">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon name="Package" className="h-4 w-4 text-success" />
                        <span className="text-sm font-medium text-muted-foreground">Материалы</span>
                      </div>
                      <p className="text-2xl font-bold text-success">
                        {viewingStageExpenses.stage.expenses
                          .filter(e => e.type === 'materials')
                          .reduce((sum, e) => sum + e.amount, 0)
                          .toLocaleString()} ₽
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-primary/10 border-primary/30">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon name="Hammer" className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">Работы</span>
                      </div>
                      <p className="text-2xl font-bold text-primary">
                        {viewingStageExpenses.stage.expenses
                          .filter(e => e.type === 'labor')
                          .reduce((sum, e) => sum + e.amount, 0)
                          .toLocaleString()} ₽
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Добавить расход</h3>
                  </div>
                  <div className="grid gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-2">
                        <Label htmlFor="expense-type">Тип расхода</Label>
                        <Select value={newExpenseType} onValueChange={(v) => setNewExpenseType(v as 'materials' | 'labor')}>
                          <SelectTrigger id="expense-type">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="materials">Материалы</SelectItem>
                            <SelectItem value="labor">Работы</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="expense-amount">Сумма</Label>
                        <Input
                          id="expense-amount"
                          type="number"
                          value={newExpenseAmount}
                          onChange={(e) => setNewExpenseAmount(e.target.value)}
                          placeholder="50000"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="expense-desc">Описание</Label>
                      <Input
                        id="expense-desc"
                        value={newExpenseDescription}
                        onChange={(e) => setNewExpenseDescription(e.target.value)}
                        placeholder="Например: Цемент М500, 10 тонн"
                      />
                    </div>
                    <Button 
                      onClick={() => {
                        addExpenseToStage(viewingStageExpenses.siteId, viewingStageExpenses.stage.id);
                      }} 
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Icon name="Plus" className="h-4 w-4 mr-2" />
                      Добавить расход
                    </Button>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <h3 className="font-semibold mb-4">История расходов</h3>
                  {viewingStageExpenses.stage.expenses.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Нет расходов</p>
                  ) : (
                    <div className="space-y-3">
                      {viewingStageExpenses.stage.expenses.map((expense) => (
                        <div
                          key={expense.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${expense.type === 'materials' ? 'bg-success/20' : 'bg-primary/20'}`}>
                              <Icon 
                                name={expense.type === 'materials' ? 'Package' : 'Hammer'} 
                                className={`h-4 w-4 ${expense.type === 'materials' ? 'text-success' : 'text-primary'}`}
                              />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{expense.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {expense.type === 'materials' ? 'Материалы' : 'Работы'} • {expense.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="font-bold">{expense.amount.toLocaleString()} ₽</p>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="hover:bg-destructive hover:text-white"
                              onClick={() => deleteExpense(viewingStageExpenses.siteId, viewingStageExpenses.stage.id, expense.id)}
                            >
                              <Icon name="Trash2" className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <footer className="border-t border-border mt-16 py-8 bg-card/50">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 СтройКонтроль. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;