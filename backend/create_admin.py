import getpass

from pydantic import EmailStr, TypeAdapter, ValidationError

from app.services.admin_service import create_admin


email_validator = TypeAdapter(EmailStr)


def main():
    print("\n=== Smart Farmer Rwanda: Admin Setup ===\n")

    full_name = input("Admin full name: ").strip()
    email = input("Admin email: ").strip()

    try:
        email = str(email_validator.validate_python(email))
    except ValidationError:
        print("Invalid email address.")
        return

    password = getpass.getpass("Create password: ")
    confirm_password = getpass.getpass("Confirm password: ")

    if password != confirm_password:
        print("Passwords do not match.")
        return

    try:
        admin = create_admin(
            full_name=full_name,
            email=email,
            password=password
        )

        print("\nAdmin account created successfully!")
        print(f"Admin ID: {admin['admin_id']}")
        print(f"Name: {admin['full_name']}")
        print(f"Email: {admin['email']}")

    except ValueError as error:
        print(f"\nCould not create Admin: {error}")


if __name__ == "__main__":
    main()