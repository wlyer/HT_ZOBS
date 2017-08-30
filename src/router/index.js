//路由懒加载

//登入
const Login = resolve => require(['../container/manage/Login.vue'], resolve);
//404
const NotFound = resolve => require(['../container/404.vue'], resolve);
//后端导航
const Home = resolve => require(['../container/manage/Home.vue'], resolve);
//后端主界面
const Main = resolve => require(['../container/Main.vue'], resolve);
//后端三级路由
const Content = resolve => require(['../container/manage/Content.vue'], resolve);

//货物管理
//图书管理
const Book = resolve => require.ensure([], () => resolve(require('../container/manage/goods/books/Book.vue')), 'group-book');
//新增图书
const AddBook = resolve => require.ensure([], () => resolve(require('../container/manage/goods/books/AddBook.vue')), 'group-book');
//修改图书
const EditBook = resolve => require.ensure([], () => resolve(require('../container/manage/goods/books/EditBook.vue')), 'group-book');
//分类管理
const BookType = resolve => require.ensure([], () => resolve(require('../container/manage/goods/bookTypes/BookType.vue')), 'group-bookType');
//单据管理
//订单管理
const Order = resolve => require.ensure([], () => resolve(require('../container/manage/receipt/orders/Order.vue')), 'group-order');
//修改订单
const EditOrder = resolve => require.ensure([], () => resolve(require('../container/manage/receipt/orders/EditOrder.vue')), 'group-order');
//订单详情
const OrderDetail = resolve => require.ensure([], () => resolve(require('../container/manage/receipt/orders/OrderDetail.vue')), 'group-order');
//订单相关的图书
const RelateBooks = resolve => require.ensure([], () => resolve(require('../container/manage/receipt/orders/RelateBooks.vue')), 'group-order');
//回收管理
const Reclaim = resolve => require.ensure([], () => resolve(require('../container/manage/receipt/reclaim/Reclaim.vue')), 'group-reclaim');
const EditReclaim = resolve => require.ensure([], () => resolve(require('../container/manage/receipt/reclaim/EditReclaim.vue')), 'group-reclaim');
const ReclaimDetail = resolve => require.ensure([], () => resolve(require('../container/manage/receipt/reclaim/ReclaimDetail.vue')), 'group-reclaim');
//系统管理
//用户管理
const User = resolve => require.ensure([], () => resolve(require('../container/manage/system/user/User.vue')), 'group-user');
const AddUser = resolve => require.ensure([], () => resolve(require('../container/manage/system/user/AddUser.vue')), 'group-user');
const EditUser = resolve => require.ensure([], () => resolve(require('../container/manage/system/user/EditUser.vue')), 'group-user');
//角色管理
const Role = resolve => require.ensure([], () => resolve(require('../container/manage/system/role/Role.vue')), 'group-role');
const AddRole = resolve => require.ensure([], () => resolve(require('../container/manage/system/role/AddRole.vue')), 'group-role');
const EditRole = resolve => require.ensure([], () => resolve(require('../container/manage/system/role/EditRole.vue')), 'group-role');
//权限管理
const Purview = resolve => require.ensure([], () => resolve(require('../container/manage/system/purview/Purview.vue')), 'group-purview');
const AddPurview = resolve => require.ensure([], () => resolve(require('../container/manage/system/purview/AddPurview.vue')), 'group-purview');
const EditPurview = resolve => require.ensure([], () => resolve(require('../container/manage/system/purview/EditPurview.vue')), 'group-purview');
//日志管理
const Log = resolve => require.ensure([], () => resolve(require('../container/manage/system/log/Log.vue')), 'group-log');
let user = sessionStorage.getItem('user')?JSON.parse(sessionStorage.getItem('user')):'';
let purview = [];
let roles = [];
if(user){
	user.roles.map((item)=>{
		roles.push(item.roleId);
	});
	if(JSON.stringify(user.purview).length>2){
		for(let i=1 ; i<=6 ; i++){
			if(user.purview[i] != undefined){
				purview.push(i);
			}
		}
	}
}
let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/goods',
        component: Home,
        name: '货物管理',
        iconCls: 'fa fa-book',//图标样式class
        redirect: '/goods/book',
        hidden:purview.indexOf(1)>-1 || purview.indexOf(2)>-1?false:true,
		children: [
            { path: 'book', component: Content, name: '图书管理',redirect: '/goods/book/list',hidden:purview.indexOf(1)>-1?false:true,
	            children: [
		            { path: 'list', component: Book, name: '图书列表' },
		            { path: 'addBook', component: AddBook, name:'新增图书' },
		            { path: 'editBook', component: EditBook, name:'修改图书' },
		        ]
	        },
            { path: 'bookType', component: Content, name: '分类管理',redirect: '/goods/bookType/list',hidden:purview.indexOf(2)>-1?false:true,
            	children: [
		            { path: 'list', component: BookType, name: '分类列表' },
		        ]
            }
        ]
    },
    {
        path: '/receipt',
        component: Home,
        name: '单据管理',
        iconCls: 'fa fa-files-o',//图标样式class
        redirect: '/receipt/order',
        hidden:purview.indexOf(3)>-1 || purview.indexOf(4)>-1?false:true,
        children: [
            { path: 'order', component: Content, name: '订单管理',redirect: '/receipt/order/list',hidden:purview.indexOf(3)>-1?false:true,
            	children: [
		            { path: 'list', component: Order, name: '订单列表' },
		            { path: 'editOrder', component: EditOrder, name: '修改订单'},
		            {path: 'orderDetail', component: OrderDetail, name: '订单详情'},
		            {path: 'relateBooks', component: RelateBooks, name: '订单相关图书'}
		        ]
            },
            { path: 'reclaim', component: Content, name: '回收管理',redirect: '/receipt/reclaim/list',hidden:purview.indexOf(4)>-1?false:true,
            	children: [
		            { path: 'list', component: Reclaim, name: '回收列表' },
		            { path: 'editReclaim', component: EditReclaim, name: '修改回收单'},
		            { path: 'reclaimDetail', component: ReclaimDetail, name: '回收单详情'},
		        ]
            }
        ]
    },
    {
        path: '/system',
        component: Home,
        name: '系统管理',
        iconCls: 'el-icon-setting',//图标样式class
        redirect: '/system/user',
        hidden:purview.indexOf(5)>-1 || purview.indexOf(6)>-1?false:true,
        children: [
            { path: 'user', component: Content, name: '用户管理',redirect: '/system/user/list',hidden:purview.indexOf(5)>-1?false:true,
            	children:[
            		{ path: 'list', component: User, name: '用户列表' },
	            	{ path: 'addUser', component: AddUser, name: '新增用户' },
	            	{ path: 'editUser', component: EditUser, name: '编辑用户' }
            	] 
            },
            { path: 'role', component: Content, name: '角色管理',redirect: '/system/role/list',hidden:purview.indexOf(6)>-1?false:true,
            	children:[
            		{ path: 'list', component: Role, name: '角色列表' },
	            	{ path: 'addRole', component: AddRole, name: '新增角色' },
            		{ path: 'editRole', component: EditRole, name: '编辑角色' },
            	] 
            },
            { path: 'purview', component: Content, name: '权限管理',redirect: '/system/purview/list',hidden:roles.indexOf('5')==-1?true:false,
            	children:[
            		{ path: 'list', component: Purview, name: '权限列表' },
	            	{ path: 'addPurview', component: AddPurview, name: '新增权限' },
           			{ path: 'editPurview', component: EditPurview, name: '编辑权限' },
            	]
            },
            { path: 'log', component: Log, name: '日志管理',hidden:roles.indexOf('5')==-1?true:false,},
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    },
];

export default routes;