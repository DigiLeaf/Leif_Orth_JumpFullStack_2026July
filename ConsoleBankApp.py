from abc import ABC, abstractmethod

# Admin credentials: admin, admin123
# User credentials: .....................


class User(ABC):
    def __init__(self):
        self.username = None
        self.password = None

    def get_username(self):
        return self.username

    def set_username(self, username):
        self.username = username

    def get_password(self):
        return self.password

    def set_password(self, password):
        self.password = password

    @abstractmethod
    def get_user_type(self):
        pass


class Admin(User):
    def get_user_type(self):
        return "admin"


class Customer(User):
    def get_user_type(self):
        return "customer"


class Bank:
    def __init__(self, id, name, customers):
        self.id = id
        self.name = name
        self.customers = customers

    def get_id(self):
        return self.id

    def set_id(self, id):
        self.id = id

    def get_name(self):
        return self.name

    def set_name(self, name):
        self.name = name

    def get_customers(self):
        return self.customers

    def set_customers(self, customers):
        self.customers = customers


class Account(ABC):
    # id,
    # balance
    pass


class AccountOperations(ABC):
    @abstractmethod
    def deposit(self):
        pass

    @abstractmethod
    def withdraw(self):
        pass

    @abstractmethod
    def transfer(self):
        pass


class CheckingAccount(Account, AccountOperations):
    def deposit(self):
        pass

    def withdraw(self):
        pass

    def transfer(self):
        pass

    # get_interest_rate() // 1%


class SavingsAccount(Account, AccountOperations):
    def deposit(self):
        pass

    def withdraw(self):
        pass

    def transfer(self):
        pass

    # get_interest_rate() // 2%


class Runner:
    users = []

    @staticmethod
    def init():
        admin = Admin()
        admin.set_username("admin")
        admin.set_password("admin123")

        customer1 = Customer()
        customer1.set_username("rohit")
        customer1.set_password("rohit123")

        customer2 = Customer()
        customer2.set_username("mohit")
        customer2.set_password("mohit123")

        customer3 = Customer()
        customer3.set_username("shobhit")
        customer3.set_password("shobhit123")

        Runner.users.append(admin)
        Runner.users.append(customer1)
        Runner.users.append(customer2)
        Runner.users.append(customer3)

    @staticmethod
    def main():
        Runner.print_message("Welcome to ABC Digital Bank")

        flag = True
        while flag:
            login_result = Runner.login()

            if login_result == "invalid":
                # exception-handling
                print("Invalid Credentials")
            elif login_result == "admin":
                Runner.admin_dashboard(login_result)
            else:
                Runner.customer_dashboard(login_result)

            print("Do you want to continue? Press y/n")
            main_loop_user_response = input()
            if main_loop_user_response.lower() == "n":
                flag = False

    @staticmethod
    def customer_dashboard(username):
        print("Welcome customer, " + username)
        # todo: using switch-case present customer options'
        # view his account or accounts, withdraw, transfer, deposit

    @staticmethod
    def admin_dashboard(login_result):
        print("Welcome admin")
        # todo: using switch-case present admin options
        # CRUD for customers, accounts etc

    @staticmethod
    def login():
        login_type = "invalid"
        print("Please enter your username and password separated by a space")  # rohit rohit123
        # validation
        entered_username_password = input()
        parts = entered_username_password.split(" ")
        entered_username = parts[0]
        entered_password = parts[1]

        if entered_username == "admin" and entered_password == "admin123":
            login_type = "admin"
        else:
            for i in range(len(Runner.users)):
                user = Runner.users[i]
                if entered_username == user.get_username() and entered_password == user.get_password():
                    login_type = user.get_username()
                    break

        return login_type

    @staticmethod
    def print_message(message):
        print(message)


if __name__ == "__main__":
    Runner.init()
    Runner.main()