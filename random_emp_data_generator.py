from faker import Faker
import random
import mysql.connector
import mysql.connector.errors as db_errors

fake = Faker()

# -------------------------
# DB CONNECTION
# -------------------------
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="09871234",
    database="Microsoft_emp"
)

cursor = db.cursor()

# -------------------------
# OPTIONAL: CLEAN RESET
# -------------------------
cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
cursor.execute("TRUNCATE TABLE attendance")
cursor.execute("TRUNCATE TABLE payroll")
cursor.execute("TRUNCATE TABLE leaves")
cursor.execute("TRUNCATE TABLE employees")
cursor.execute("TRUNCATE TABLE departments")
cursor.execute("TRUNCATE TABLE roles")
cursor.execute("SET FOREIGN_KEY_CHECKS = 1")

# -------------------------
# 1. INSERT DEPARTMENTS
# -------------------------
departments = ["HR", "Engineering", "Sales", "Marketing", "Finance",
               "IT", "Operations", "Legal", "Support", "R&D"]

for dept in departments:
    cursor.execute(
        "INSERT INTO departments (name, location) VALUES (%s, %s)",
        (dept, fake.city())
    )

# -------------------------
# 2. INSERT ROLES
# -------------------------
roles = [
    "Software Engineer", "Manager", "Analyst", "HR Executive",
    "Data Scientist", "DevOps Engineer", "QA Engineer",
    "Product Manager", "Designer", "Consultant"
]

for role in roles:
    cursor.execute(
        "INSERT INTO roles (title, level, base_salary) VALUES (%s, %s, %s)",
        (
            role,
            random.choice(["Junior", "Mid", "Senior"]),
            random.randint(300000, 2000000)
        )
    )

db.commit()

# -------------------------
# 3. FETCH REAL IDS
# -------------------------
cursor.execute("SELECT id FROM departments")
department_ids = [row[0] for row in cursor.fetchall()]

cursor.execute("SELECT id FROM roles")
role_ids = [row[0] for row in cursor.fetchall()]

# -------------------------
# 4. INSERT EMPLOYEES (200)
# -------------------------
for _ in range(200):
    phone = ''.join(filter(str.isdigit, fake.phone_number()))[:15] or "0000000000"

    cursor.execute("""
        INSERT INTO employees 
        (first_name, last_name, email, phone, department_id, role_id, manager_id, hire_date, salary)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """, (
        fake.first_name(),
        fake.last_name(),
        fake.unique.email(),
        phone,
        random.choice(department_ids),
        random.choice(role_ids),
        None,  # temporary
        fake.date_between(start_date='-5y', end_date='today'),
        random.randint(300000, 2500000)
    ))

db.commit()

# -------------------------
# 5. FETCH EMPLOYEE IDS
# -------------------------
cursor.execute("SELECT id FROM employees")
employee_ids = [row[0] for row in cursor.fetchall()]

# -------------------------
# 6. ASSIGN MANAGERS (KEY STEP)
# -------------------------
top_managers = random.sample(employee_ids, k=int(len(employee_ids) * 0.1))

for emp_id in employee_ids:
    if emp_id in top_managers:
        manager_id = None
    else:
        possible_managers = [m for m in employee_ids if m != emp_id]
        manager_id = random.choice(possible_managers)

    cursor.execute("""
        UPDATE employees
        SET manager_id = %s
        WHERE id = %s
    """, (manager_id, emp_id))

db.commit()

# -------------------------
# 7. INSERT ATTENDANCE (200)
# -------------------------
for _ in range(200):
    cursor.execute("""
        INSERT INTO attendance (employee_id, date, check_in, check_out, status)
        VALUES (%s,%s,%s,%s,%s)
    """, (
        random.choice(employee_ids),
        fake.date_this_year(),
        fake.time(),
        fake.time(),
        random.choice(["present", "absent", "leave"])
    ))

# -------------------------
# 8. INSERT PAYROLL (200)
# -------------------------
for _ in range(200):
    base = random.randint(300000, 2000000)
    bonus = random.randint(10000, 100000)
    deduction = random.randint(5000, 50000)

    cursor.execute("""
        INSERT INTO payroll 
        (employee_id, month, year, base_salary, bonus, deductions, net_salary)
        VALUES (%s,%s,%s,%s,%s,%s,%s)
    """, (
        random.choice(employee_ids),
        random.choice(["Jan", "Feb", "Mar", "Apr"]),
        2025,
        base,
        bonus,
        deduction,
        base + bonus - deduction
    ))

# -------------------------
# 9. INSERT LEAVES (200)
# -------------------------
for _ in range(200):
    start = fake.date_this_year()
    end = fake.date_this_year()

    cursor.execute("""
        INSERT INTO leaves 
        (employee_id, start_date, end_date, leave_type, status)
        VALUES (%s,%s,%s,%s,%s)
    """, (
        random.choice(employee_ids),
        start,
        end,
        random.choice(["sick", "casual", "earned"]),
        random.choice(["pending", "approved", "rejected"])
    ))

db.commit()

cursor.close()
db.close()

print("✅ Clean dataset with relationships created successfully!")