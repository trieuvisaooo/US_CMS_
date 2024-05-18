module.exports = class Role{
    constructor(role)
    {
        this.role = role;
    }
    static async checkRole(rol){
        var role= {id:0,name:""};
        switch (rol)
        {
            case 1:
                role.id = 1;
                role.name = "Trưởng CLB"
                break;
            case 2:
                role.id = 2;
                role.name = "Phó CLB"
                break;
            case 3:
                role.id = 3;
                role.name = "Thành viên"
                break;
        }
        return role
    }
}