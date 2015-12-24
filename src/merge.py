#!/usr/bin/python

# import the MySQLdb and sys modules
import MySQLdb
import sys

def populate_va_user_details_data():
    # execute the SQL query using execute() method.
    cursor.execute ("select * from va_user_details")
    # fetch all of the rows from the query
    data = cursor.fetchall ()
    #print "id \t last_name\t "
    #for row in data :
    #    print row[0], row[3]
    va_user_details_data={}
    for row in data:
        va_user_details_data['last_name'] = row[3]
        print va_user_details_data

def populate_va_users_data():
    # print the rows
    #print "id \t name\t email\t user_type\t centre\t participants\t experiments\t created_on\t last_loggedin"
    #for row in data :
    #    print row[0], row[1], row[2], row[4], row[6], row[7], row[9], row[10], row[14], row[15]
    #va_users_data = {}
    # execute the SQL query using execute() method.
    cursor.execute ("select * from va_users")
    # fetch all of the rows from the query
    data = cursor.fetchall ()
    va_users_data={}
    for row in data:
        va_users_data['id'] = row[0]
        va_users_data['name'] = row[1]
        va_users_data['email'] = row[2]
        va_users_data['user_type'] = row[5]
        va_users_data['centre'] = row[6]
        va_users_data['participants'] = row[10]
        va_users_data['experiments'] = row[11]
        va_users_data['created_on'] = row[14]
        va_users_data['last_loggedin'] = row[15]
        print va_users_data



if __name__ == "__main__":
    # open a database connection
    connection = MySQLdb.connect(host = "localhost", user = "root",
                                 passwd = "root", db = "old_outreach")
    # prepare a cursor object using cursor() method
    cursor = connection.cursor()

    populate_va_user_details_data()
    populate_va_users_data()

    #close the cursor object
    cursor.close()

    # close the connection
    connection.close()

    # exit the program
    sys.exit()
