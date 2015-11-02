
class Name(object):
    def __init__(self, value):
        # if the string contains any non-alphabet and non-space character, raise
        # a type error
        if re.search('[^a-zA-Z. ]+', value):
            raise TypeError('%s is not a Name!' % value)

        self.value = value

class Email(object):
    def __init__(self, value):
        if not re.search('[^@]+@[^@]+\.[^@]+', value):
            raise TypeError('%s is not an email!' % value)
        self.value = value

class Status(Entity):
    __tablename__ = 'status'
    id = db.Column(db.Integer, primary_key=True)
    status_of_entity = db.Column(db.String(64), nullable=False, unique=True)

    workshops = db.relationship('Workshop', backref='status')

    @staticmethod
    def get_by_id(id):
        return Status.query.get(id)

    @staticmethod
    def get_by_status(status):
        return Status.query.filter_by(status_of_entity=status).first()

    def to_client(self):
        return {
            'id': self.id,
            'status_of_entity': self.status_of_entity
        }

    @staticmethod
    def get_all():
        return Status.query.all()

class OutreachCoordinator(Entity):

    __tablename__ = 'outreach_coordinators'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), unique=True)
    created = db.Column(db.DateTime, default=datetime.utcnow)
    last_active = db.Column(db.DateTime, default=datetime.utcnow)

    nodal_coordinators = db.relationship('NodalCoordinator', backref='outreach_coordinator')

    def __init__(self, **kwargs):
        if 'name' not in kwargs:
            raise AttributeRequired("mandatory attribute `name` is missing")
        self.set_name(kwargs['name'])

        if 'email' not in kwargs:
            raise AttributeRequired("mandatory attribute `email` is missing")
        self.set_email(kwargs['email'])

        if 'created' not in kwargs:
            raise AttributeRequired("mandatory attribute `created` is missing")

        if not isinstance(kwargs['created'], time):
            raise TypeError("created should be of type time")
        self.created = kwargs['created']
     
        if 'last_active' not in kwargs:
            raise AttributeRequired("mandatory attribute `last_active` is missing")
        self.set_last_active(kwargs['last_active'])

    def get_name(self):
        return self.name

    def get_email(self):
        return self.email

    @typecheck(name=Name)
    def set_name(self, name):
        self.name = name.value

    @typecheck(email=Email)
    def set_email(self, email):
        self.email = email.value

    @typecheck(=)
    def set_last_active(self, ):

class NodalCoordinator(Entity):

    __tablename__ = 'nodal_coordinators'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), unique=True)
    created = db.Column(db.DateTime, default=datetime.utcnow)
    last_active = db.Column(db.DateTime, default=datetime.utcnow)
    created_by =  db.Column(db.Integer, db.ForeignKey('outreach_coordinators.id'))
    target_workshop = db.Column(db.Integer)
    target_participants = db.Column(db.Integer)
    target_experiments = db.Column(db.Integer)
    current_workshops = db.Column(db.Integer)
    current_participants = db.Column(db.Integer)
    current_experiments = db.Column(db.Integer)

    nodal_centres = db.relationship('NodalCentre', backref='nodal_coordinator')
    coordinator_trainings = db.relationship('NodalCoordinatorsTraining', backref='nodal_coordinator')
    workshops = db.relationship('Workshop', backref='nodal_coordinator')

    def __init__(self, **kwargs):
        if 'name' not in kwargs:
            raise AttributeRequired("mandatory attribute `name` is missing")
        self.set_name(kwargs['name'])

        if 'email' not in kwargs:
            raise AttributeRequired("mandatory attribute `email` is missing")
        self.set_email(kwargs['email'])

        if 'created' not in kwargs:
            raise AttributeRequired("mandatory attribute `creation time` is missing")

        if not isinstance(kwargs['created'], time):
            raise TypeError("created should be of type time")
        self.created = kwargs['created']

        if 'created_by' not in kwargs:
            raise AttributeRequired("mandatory attribute `created_by` is missing")
        self.set_created_by(kwargs['created_by'])

        if 'target_workshops' not in kwargs:
            raise AttributeRequired("mandatory attribute `target_workshops` is missing")
        self.set_target_workshops(kwargs['target_workshops'])

        if 'target_participants' not in kwargs:
            raise AttributeRequired("mandatory attribute `target_participants` is missing")
        self.set_target_participants(kwargs['target_participants'])

        if 'target_experiments' not in kwargs:
            raise AttributeRequired("mandatory attribute `target_experiments' is missing")
        self.set_target_experiments(kwargs['target_experiments'])

        if 'current_workshops' not in kwargs:
            raise AttributeRequired("mandatory attribute `current_workshops` is missing")
        self.set_current_workshops(kwargs['current_workshops'])

        if 'current_participants' not in kwargs:
            raise AttributeRequired("mandatory attribute `current_participants` is missing")
        self.set_current_participants(kwargs['current_participants'])

        if 'current_experiments' not in kwargs:
            raise AttributeRequired("mandatory attribute `current_experiments` is missing")
        self.set_current_experiments(kwargs['current_experiments'])

        if 'last_active' in kwargs:
            self.set_last_active(kwargs['last_active'])

    def get_name(self):
        return self.name

    def get_email(self):
        return self.email

    def get_created_by(self):
        return self.created_by

    def get_target_workshops(self):
        return self.target_workshops

    def get_target_participants(self):
        return self.target_participants

    def get_target_experiments(self):
        return self.target_experiments

    def get_current_workshops(self):
        return self.current_workshops

    def get_current_participants(self):
        return self.current_participants

    def get_current_experiments(self):
        return self.current_experiments

    @typecheck(name=Name)
    def set_name(self, name):
        self.name = name

    @typecheck(email=Email)
    def set_email(self, email):
        self.email = email.value

    @typecheck(created_by=OutreachCoordinator)
    def set_created_by(self, created_by):
        self.created_by = created_by

    @typecheck(target_workshops=int)
    def set_target_workshops(self, target_workshops):
        self.target_workshops = target_workshops

    @typecheck(target_participants=int)
    def set_target_participants(self, target_participants):
        self.target_participants = target_participants

    @typecheck(target_experiments=int)
    def set_target_experiments(self, target_experiments):
        self.target_experiments = target_experiments

    @typecheck(current_workshops=int)
    def set_current_workshops(self, current_workshops):
        self.current_workshops = current_workshops

    @typecheck(current_participants=int)
    def set_current_participants(self, current_participants):
        self.current_participants = current_participants

    @typecheck(current_experiments=int)
    def set_current_experiments(self, current_experiments):
        self.current_experiments = current_experiments

class NodalCentre(Entity):

    __tablename__ = 'nodal_centres'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    location = db.Column(db.String(128), nullable=False)

    coordinator =  db.Column(db.Integer, db.ForeignKey('nodal_coordinators.id'))

    def __init__(self, **kwargs):
        if 'name' not in kwargs:
            raise AttributeRequired("mandatory attribute `name` is missing")
        self.set_name(kwargs['name'])

        if 'location' not in kwargs:
            raise AttributeRequired("mandatory attribute `location` is missing")
        self.set_location(kwargs['location'])

        if 'coordinator' not in kwargs:
            raise AttributeRequired("mandatory attribute `coordinator` is missing")
        self.set_coordinator(kwargs['coordinator'])

    def get_name(self):
        return self.name

    def get_location(self):
        return self.location

    def get_coordinator(self):
        return self.coordinator

    @typecheck(name=Name)
    def set_name(self, name):
        self.name = name

    @typecheck(location=str)
    def set_location(self, location):
        self.location = location

    @typecheck(coordinator=NodalCoordinator)
    def set_coordinator(self, coordinator):
        self.coordinator = coordinator

class NodalCoordinatorsTraining(Entity):

    __tablename__ = 'nodal_coordinators_trainings'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    location = db.Column(db.String(128))
    date = db.Column(db.DateTime, default=datetime.utcnow) 
    duration = db.Column(db.Integer)
    description = db.Column(db.String(128))
    invitees = db.Column(db.String(128))

    created_by = db.Column(db.Integer, db.ForeignKey('nodal_coordinators.id'))

    def __init__(self, **kwargs):
        if 'name' not in kwargs:
            raise AttributeRequired("mandatory attribute `name` is missing")
        self.set_name(kwargs['name'])

        if 'location' not in kwargs:
            raise AttributeRequired("mandatory attribute `location` is missing")
        self.set_location(kwargs['location'])

        if 'date' not in kwargs:
            raise AttributeRequired("mandatory attribute `date` is missing")
        self.set_date(kwargs['date'])

        if 'created_by' not in kwargs:
            raise AttributeRequired("mandatory attribute `created_by` is missing")
        self.set_created_by(kwargs['created_by'])

        if 'duration' in kwargs:
        self.set_duration(kwargs['duration'])

        if 'description' in kwargs:
        self.set_description(kwargs['description'])

        if 'invitees' in kwargs:
        self.set_invitees(kwargs['invitees'])

    def get_name(self):
        return self.name

    def get_location(self):
        return self.location

    def get_date(self):
        return self.date

    def get_created_by(self):
        return self.created_by

    def get_duration(self):
        return self.created_by

    def get_description(self):
        return self.description

    def get_invitees(self):
        return self.invitees

    @typecheck(name=Name)
    def set_name(self, name):
        self.name = name

    @typecheck(location=str)
    def set_location(self, location):
        self.location = location

    @typecheck(date=Date)
    def set_date(self, date):
        self.date = date

    @typecheck(created_by=NodalCoordinator)
    def set_created_by(self, created_by):
        self.created_by = created_by

    @typecheck(duration=int)
    def set_duration(self, duration):
        self.duration = duration

    @typecheck(invitees=str)
    def set_invitees(self, invitees):
        self.invitees = invitees

    @typecheck(description=str)
    def set_description(self, description):
        self.description = description

class Workshop(Entity):

    __tablename__ = 'workshops'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    location = db.Column(db.String(128))
    date = db.Column(db.DateTime, default=datetime.utcnow) 
    institutes = db.Column(db.String(128))
    no_of_participants = db.Column(db.Integer)
    no_of_sessions = db.Column(db.Integer)
    duration_of_sessions = db.Column(db.Integer)
    labs_planned = db.Column(db.Integer)
    discipline = db.Column(db.String(128))
    other_details = db.Column(db.String(128))
    status =

    created = db.Column(db.DateTime, default=datetime.utcnow) 
    last_updated = db.Column(db.DateTime, default=datetime.utcnow) 
   
    conducted_by = db.Column(db.Integer, db.ForeignKey('nodal_coordinators.id'))
    reports = db.relationship('WorkshopReport', backref='workshops')

    def __init__(self, **kwargs):
        if 'name' not in kwargs:
            raise AttributeRequired("mandatory attribute `name` is missing")
        self.set_name(kwargs['name'])

        if 'location' not in kwargs:
            raise AttributeRequired("mandatory attribute `location` is missing")
        self.set_location(kwargs['location'])

        if 'date' not in kwargs:
            raise AttributeRequired("mandatory attribute `date` is missing")
        self.set_date(kwargs['date'])

        if 'created' not in kwargs:
            raise AttributeRequired("mandatory attribute `created` is missing")

        if not isinstance(kwargs['created'], date):
            raise TypeError("created should be of type date")
        self.created = kwargs['created']

        if 'institutes' not in kwargs:
            raise AttributeRequired("mandatory attribute `institutes` is missing")
        self.set_institutes(kwargs['institutes'])

        if 'no_of_participants' not in kwargs:
            raise AttributeRequired("mandatory attribute `no_of_participants` is missing")
        self.set_no_of_participants(kwargs['no_of_participants'])

        if 'no_of_sessions' not in kwargs:
            raise AttributeRequired("mandatory attribute `no_of_sessions` is missing")
        self.set_no_of_sessions(kwargs['no_of_sessions'])

        if 'duration_of_sessions' not in kwargs:
            raise AttributeRequired("mandatory attribute `duration_of_sessions` is missing")
        self.set_duration_of_sessions(kwargs['duration_of_sessions'])

        if 'labs_planned' not in kwargs:
            raise AttributeRequired("mandatory attribute `labs_planned` is missing")
        self.set_labs_planned(kwargs['labs_planned'])

        if 'discipline' not in kwargs:
            raise AttributeRequired("mandatory attribute `discipline` is missing")
        self.set_discipline(kwargs['discipline'])

        if 'conducted_by' not in kwargs:
            raise AttributeRequired("mandatory attribute `conducted_by` is missing")
        self.set_conducted_by(kwargs['conducted_by'])

        if 'last_updated' not in kwargs:
            raise AttributeRequired("mandatory attribute `last_updated` is missing")
        self.set_last_updated(kwargs['last_updated'])

        if 'status' not in kwargs:
            raise AttributeRequired("mandatory attribute `status` is missing")
        self.set_status(kwargs['status'])

        if 'other_details' in kwargs:
            self.set_other_details(kwargs['other_details'])

    def get_name(self):
        return self.name

    def get_location(self):
        return self.location

    def get_date(self):
        return self.date

    def get_institutes(self):
        return self.institutes

    def get_no_of_participants(self):
        return self.no_of_participants

    def get_no_of_sessions(self):
        return self.no_of_sessions

    def get_duration_of_sessions(self):
        return self.duration_of_sessions

    def get_labs_planned(self):
        return self.labs_planned

    def get_discipline(self):
        return self.discipline

    def get_conducted_by(self):
        return self.conducted_by

    def get_last_updated(self):
        return self.last_updated

    def get_status(self):
        return self.status

    def get_other_details(self):
        return self.other_details

    @typecheck(name=Name)
    def set_name(self, name):
        self.name = name

    @typecheck(location=str)
    def set_location(self, location):
        self.location = location

    @typecheck(date=Date)
    def set_date(self, date):
        self.date = date

    @typecheck(institutes=str)
    def set_institutes(self, institutes):
        self.institutes = institutes

    @typecheck(no_of_participants=int)
    def set_no_of_participants(self, no_of_participants):
        self.no_of_participants = no_of_participants

    @typecheck(no_of_sessions=int)
    def set_no_of_sessions(self, no_of_sessions):
        self.no_of_sessions = no_of_sessions

    @typecheck(duration_of_sessions=int)
    def set_duration_of_sessions(self, duration_of_sessions):
        self.duration_of_sessions = duration_of_sessions

    @typecheck(labs_planned=int)
    def set_labs_planned(self, labs_planned):
        self.labs_planned = labs_planned

    @typecheck(discipline=str)
    def set_discipline(self, discipline):
        self.discipline = discipline

    @typecheck(conducted_by=NodalCoordinator)
    def set_conducted_by(self, conducted_by):
        self.conducted_by = conducted_by

    @typecheck(other_details=str)
    def set_other_details(self, other_details):
        self.other_details = other_details

class WorkshopDocument(Entity):

    __tablename__ = 'workshop_documents'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    path = db.Column(db.String(128), nullable=False)

    def __init__(self, **kwargs):
        if 'name' not in kwargs:
            raise AttributeRequired("mandatory attribute `name` is missing")
        self.set_name(kwargs['name'])

        if 'path' not in kwargs:
            raise AttributeRequired("mandatory attribute `path` is missing")
        self.set_path(kwargs['path'])

    def get_name(self):
        return self.name

    def get_path(self):
        return self.path

    @typecheck(name=Name)
    def set_name(self, name):
        self.name = name

    @typecheck(path=str)
    def set_path(self, path):
        self.path = path

class WorkshopReport(Entity):

    __tablename__ = 'workshop_reports'

    id = db.Column(db.Integer, primary_key=True)
    workshop_id = db.Column(db.Integer, db.ForeignKey('workshops.id'))
    
    participants_attended=db.Column(db.Integer)
    experiments_conducted=db.Column(db.Integer)
    positive_comments = db.Column(db.String(128))
    negative_comments = db.Column(db.String(128))
    photos = db.relationship('WorkshopPhoto', backref='workshop_reports')

    created =
    last_updated = 
    attendance_sheet =
    college_report = 

    def __init__(self, **kwargs):
        if 'workshop' not in kwargs:
            raise AttributeRequired("mandatory attribute `workshop` is missing")
        self.set_workshop(kwargs['workshop'])

        if 'participants_attended' not in kwargs:
            raise AttributeRequired("mandatory attribute `participants_attended` is missing")
        self.set_participants_attended(kwargs['participants_attended'])

        if 'experiments_conducted' not in kwargs:
            raise AttributeRequired("mandatory attribute `experiments_conducted` is missing")
        self.set_experiments_conducted(kwargs['experiments_conducted'])

        if 'photos' not in kwargs:
            raise AttributeRequired("mandatory attribute `photos` is missing")
        self.set_photos(kwargs['photos'])

        if 'created' not in kwargs:
            raise AttributeRequired("mandatory attribute `created` is missing")

        if not isinstance(kwargs['created'], time):
            raise TypeError("created should be of type time")
        self.created = kwargs['created']

       if 'positive_comments' not in kwargs:
            raise AttributeRequired("mandatory attribute `positive_comments` is missing")
        self.set_positive_comments(kwargs['positive_comments'])

       if 'last_updated' not in kwargs:
            raise AttributeRequired("mandatory attribute `last_updated` is missing")
        self.set_last_updated(kwargs['last_updated'])

       if 'attendance_sheet' not in kwargs:
            raise AttributeRequired("mandatory attribute `attendance_sheet` is missing")
        self.set_attendance_sheet(kwargs['attendance_sheet'])
       
       if 'college_report' not in kwargs:
            raise AttributeRequired("mandatory attribute `college_report` is missing")
        self.set_college_report(kwargs['college_report'])

 

class WorkshopPhoto(Entity):

    __tablename__ = 'workshop_photos'

    id = db.Column(db.Integer, primary_key=True)
    path = db.Column(db.String(128))
    workshop_report_id = db.Column(db.Integer, db.ForeignKey('workshop_reports.id'))
    

    def __init__(self, **kwargs):
        if 'path' not in kwargs:
            raise AttributeRequired("mandatory attribute `path` is missing")
        self.set_path(kwargs['path'])

        if 'workshop_report' not in kwargs:
            raise AttributeRequired("mandatory attribute `workshop_report` is missing")
        self.set_workshop_report(kwargs['workshop_report'])
