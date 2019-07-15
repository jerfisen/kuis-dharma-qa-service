import { Entity, PrimaryGeneratedColumn, Column, Index, AfterLoad,  } from 'typeorm';
import * as firebase_admin from 'firebase-admin';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
@Entity()
export class User {
    @PrimaryGeneratedColumn('increment', { type: 'int' })
    id: number;

    @Index()
    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    firebase_uid : string;
    
    @Column({ 
        type:'simple-array',
        default: [],
    })
    fcm_token : string[];

    @AfterLoad()
    async updateFirebaseData() {
        const firebase_data = await firebase_admin.auth().getUser(this.firebase_uid);
        this.uid = this.firebase_uid;
        this.email = firebase_data.email;
        this.is_email_verified = firebase_data.emailVerified;
        this.phone_number = firebase_data.phoneNumber;
        this.display_name = firebase_data.displayName;
        this.photo_url = firebase_data.photoURL;
        this.disabled = firebase_data.disabled;
    }

    @Field()
    uid: string;

    @Field({ nullable: true })
    email: string;

    @Field()
    is_email_verified: boolean;

    @Field({ nullable: true })
    @Field()
    phone_number: string;

    @Field({ nullable: true })
    display_name: string;

    @Field({ nullable: true })
    photo_url: string;

    @Field()
    disabled: boolean;
}