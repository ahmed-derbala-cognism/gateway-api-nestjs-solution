import { Inject, Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class PersonService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async searchPersons(createPersonDto: CreatePersonDto) {
    const cacheData = await this.cacheManager.get('ceo');
    if (cacheData) return cacheData;

    const url =
      'https://app-staging.cognism.com/api/graph/person/search?indexFrom=0&indexSize=25';
    const headers = {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'en-US,en;q=0.9,ar;q=0.8',
      'content-type': 'application/json',
      cookie:
        'mutiny.user.token=aaf767c8-dead-4e87-a92d-87a69385fafe; ps_mode=trackingV1; _gcl_au=1.1.1515609223.1712318094; sbjs_migrations=1418474375998%3D1; sbjs_first_add=fd%3D2024-04-05%2012%3A54%3A54%7C%7C%7Cep%3Dhttps%3A%2F%2Fwww.cognism.com%2F%7C%7C%7Crf%3Dhttps%3A%2F%2Fcognism.zoom.us%2F; sbjs_current=typ%3Dreferral%7C%7C%7Csrc%3Dcognism.zoom.us%7C%7C%7Cmdm%3Dreferral%7C%7C%7Ccmp%3D%28none%29%7C%7C%7Ccnt%3D%2F%7C%7C%7Ctrm%3D%28none%29; sbjs_first=typ%3Dreferral%7C%7C%7Csrc%3Dcognism.zoom.us%7C%7C%7Cmdm%3Dreferral%7C%7C%7Ccmp%3D%28none%29%7C%7C%7Ccnt%3D%2F%7C%7C%7Ctrm%3D%28none%29; _fbp=fb.1.1712318096365.1273112575; hubspotutk=e570ec763b2bd51366e57cfb75ef08b4; __hssrc=1; _hjSessionUser_2622162=eyJpZCI6Ijk1NWM4NTA3LTRmMzctNTcxMi05NWVjLWNiNTM1NDg5ZTQ5MSIsImNyZWF0ZWQiOjE3MTIzMTgwOTY1MzMsImV4aXN0aW5nIjp0cnVlfQ==; _rdt_uuid=1712318094033.52f1bdfd-d6fa-4f4a-aad0-f93e8276db17; sbjs_current_add=fd%3D2024-04-08%2010%3A33%3A21%7C%7C%7Cep%3Dhttps%3A%2F%2Fwww.cognism.com%2F%7C%7C%7Crf%3Dhttps%3A%2F%2Fcognism.zoom.us%2F; sbjs_udata=vst%3D3%7C%7C%7Cuip%3D%28none%29%7C%7C%7Cuag%3DMozilla%2F5.0%20%28X11%3B%20Linux%20x86_64%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F123.0.0.0%20Safari%2F537.36%20Edg%2F123.0.0.0; __q_state_5KE73Jag5LbR5m3T=eyJ1dWlkIjoiNmM0ZDM3NGUtM2E3Ni00OWUwLTgyOGMtODNjMDNiZDQwNDI5IiwiY29va2llRG9tYWluIjoiY29nbmlzbS5jb20iLCJtZXNzZW5nZXJFeHBhbmRlZCI6ZmFsc2UsInByb21wdERpc21pc3NlZCI6ZmFsc2UsImNvbnZlcnNhdGlvbklkIjoiMTM3MDU2MDkyODc1Njg0MzQ5MSJ9; _uetvid=51927170f34311eeada7d3edaefe7334; __hstc=70525647.e570ec763b2bd51366e57cfb75ef08b4.1712318096912.1712566007347.1712568803303.3; _ga_464KJQVP8W=GS1.1.1712566000.2.1.1712568983.60.0.0; __stripe_mid=2db70f44-3e7f-4c36-8fb6-e9f4b7d3b56b84e831; __zlcmid=1LJmeHfUdXnSi6z; _gid=GA1.2.979486906.1715026537; _ga_TMK8TGC1K9=GS1.1.1715026534.18.1.1715026537.0.0.0; _ga=GA1.1.926993774.1712318094; __stripe_sid=b7d9106d-bf67-4819-b841-d623cbc23df889951e; cognism.session=eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7ImVtYWlsIjoiYWhtZWQuZGVyYmFsYUBjb2duaXNtLmNvbSIsInNlc3Npb24iOiJVc2VyLVMtYjA5Yjc4NDYtNDRlZC00NGEwLTgyZDktZTY4NDkyMDA2YzRjIiwiYXBwIjoiQVBQIiwiYWNjb3VudCI6ImNvZ25pc20iLCJsb2dpblR5cGUiOiJTVEFOREFSRF9MT0dJTiIsInN3aXRjaGVyIjoiIn0sImV4cCI6MTcxNTQ1OTExOCwibmJmIjoxNzE1MDI3MTE4LCJpYXQiOjE3MTUwMjcxMTh9.gnOsfws9eMlVRaMz_48yHbksJA_iaTDQ8bT4ZXOrXq4',
      origin: 'https://app-staging.cognism.com',
      priority: 'u=1, i',
      'sec-ch-ua':
        '"Chromium";v="124", "Microsoft Edge";v="124", "Not-A.Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Linux"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',
      'x-cognism-client': 'Search',
      'x-cognism-client-version': '0.1250.0',
    };

    const data = {
      titles: ['ceo'],
      company: {
        options: {
          match_exact_company_name: false,
          match_exact_domain: false,
          filter_domain: 'exists',
          location_Type: 'ALL',
          events_operator: 'OR',
          sort_fields: ['weight', 'revenue'],
          merge_industries: true,
          include_events: true,
          show_max_events: 100,
          operators: {},
          show_max_techs: 0,
        },
      },
      regions: ['EMEA'],
      options: {
        match_exact_job_title: false,
        show_company_events: true,
        show_contact_data: false,
        ai_job_title: true,
        sort_fields: ['com.profile_score;DESC', 'com.email.src.at;DESC'],
        operators: {},
        show_person_events: true,
      },
      icpSearch: [],
    };

    try {
      const response = await this.httpService
        .post(url, data, { headers })
        .toPromise();
      await this.cacheManager.set('ceo', response.data, 30000);

      return response.data;
    } catch (error) {
      throw new Error('Error searching persons: ' + error.message);
    }
  }

  findAll() {
    return `This action returns all person`;
  }

  findOne(id: number) {
    return `This action returns a #${id} person`;
  }

  update(id: number, updatePersonDto: UpdatePersonDto) {
    return `This action updates a #${id} person`;
  }

  remove(id: number) {
    return `This action removes a #${id} person`;
  }
}
