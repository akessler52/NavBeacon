
import urllib2
import csv
import requests
from bs4 import BeautifulSoup

#DEFINE FUNCTIONS
def getDirectoryInformation(url, department):
	"Print out the information for Faculty Member"
	resp = requests.get(url)
	soup = BeautifulSoup(resp.text, 'lxml')


	#Get the name of the faculty member
	try:
		name = soup.find('div', {"class": "field field-name-pseudofield-full-name field-type-text field-label-hidden field-wrapper"}).text.strip()
	except:
		name = ''

	#Get the position for the faculty member
	try:
		position = soup.find('span', {"class": "textformatter-list"}).text.strip()
	except:
		position = ''

	#Get the office location for the faculty member
	try:
		location = soup.find('div', {"class": "field field-name-field-location field-type-text field-label-above field-wrapper"}).text.strip()
		locationStart = (location.index('-')) - 1
		location = location[locationStart:locationStart + 5]
	except:
		location = ''

	#Get the phone number of the faculty member
	try:
		phone = soup.find('div', {"class": "field field-name-field-phone-office field-type-text field-label-inline inline field-wrapper"}).text.strip()
		phoneStart = (phone.index('('))
		phone = phone[phoneStart:phoneStart + 14]
	except:
		phone = ''

	#email = soup.find('div', {"class": "field field-name-field-email field-type-email field-label-hidden field-wrapper"}).text.strip()
	#print email

	#write the information the the directory.csv file
	row = name+", "+position+", "+location+", "+phone+", "+department+"\n"	
	csv.write(row)
	return

def scrapeFromDepartment (url, department):
	"Gather the url for each professor/faculty member and then call getDirectoryInformation on each one"
	resp = requests.get(url)
	soup = BeautifulSoup(resp.text, 'lxml')

	links = soup.find_all('a', {"class": "th"}, href = True)
	urls = []

	for link in links:
		url = 'https://wmich.edu' + link['href']
		getDirectoryInformation(url, department)
	return

def writeToCSV (name, position, location, phone):

	return


#Set up the csv file to write the data to (directory.csv)
directoryFile = "directory.csv"
csv = open(directoryFile, 'w')

headerRowNames = "Name, Position, Location, Phone, Department\n"
csv.write(headerRowNames)

#Scrape the information for the faculty of each department in the WMU College of Engineering and Applied Sciences
scrapeFromDepartment('https://wmich.edu/cs/directory', 'Computer Science')
scrapeFromDepartment('https://wmich.edu/chemicalandpaper/directory', 'Chemical and Paper Engineering')
scrapeFromDepartment('https://wmich.edu/civil-construction/directory' ,'Civil and Construction Engineering')
scrapeFromDepartment('https://wmich.edu/electrical-computer/directory', 'Electrical and Computer Engineering')
scrapeFromDepartment('https://wmich.edu/edmms/directory', 'Engineering Design, Manufacturing and Management Sytems')
scrapeFromDepartment('https://wmich.edu/ieeem/directory', 'Industrial and Entrepreneurial Engineering and Engineering Management')
scrapeFromDepartment('https://wmich.edu/mechanicalaerospace/directory', 'Mechanical and Aerospace Engineering')

