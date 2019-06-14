#include<bits/stdc++.h>
using namespace std;
const char user_id[]="<user_id>";
const char user_name[]="<user_name>";
const char custom_game_id[]="<custom_game_id>";
const int BUFFER_SIZE=1000;
char buf[BUFFER_SIZE]={'\0'};
void sleep(double s){
	clock_t st=clock();
	while(clock()-st<s*CLOCKS_PER_SEC){}
}
const int MAX_PLAYERS=8;
int playerIndex;
int playerCount;
char replay_id[BUFFER_SIZE];
char chat_room[BUFFER_SIZE];
const int MAX_NAME_LENGTH=233;//18
int teams[MAX_PLAYERS];
char player_names[MAX_PLAYERS][MAX_NAME_LENGTH];
void game_start(){
	scanf("%d",&playerIndex);
	scanf("%s",replay_id);
	scanf("%s",chat_room);
	scanf("%d",&playerCount);
	printf("# Game starting! The replay will be available after the game at http://bot.generals.io/replays/%s\n",replay_id);
	printf("chat_message %s I was written in c++!\n",chat_room);
	fflush(stdout);
	for(int i=0;i<playerCount;i++){
		scanf("\n%[^\n]",player_names[i]);
	}
	for(int i=0;i<playerCount;i++){
		scanf("%d",&teams[i]);
	}
}
int turn;
int height;
int width;
const int TILE_EMPTY=-1;
const int TILE_MOUNTAIN=-2;
const int TILE_FOG=-3;
const int TILE_FOG_OBSTACLE=-4;
const int MAP_H=100;
const int MAP_W=100;
int terrain[MAP_H][MAP_W];
int armies[MAP_H][MAP_W];
int gen_x[MAX_PLAYERS],gen_y[MAX_PLAYERS];
int total[MAX_PLAYERS],tiles[MAX_PLAYERS];
bool isCity[MAP_H][MAP_W];
void game_update(){
	scanf("%d",&turn);
	scanf("%d%d",&height,&width);
	for(int x=0;x<height;x++){
		for(int y=0;y<width;y++){
			scanf("%d",&armies[x][y]);
		}
	}
	for(int x=0;x<height;x++){
		for(int y=0;y<width;y++){
			scanf("%d",&terrain[x][y]);
		}
	}
	memset(isCity,false,sizeof isCity);
	int cityCount;
	scanf("%d",&cityCount);
	for(int i=0;i<cityCount;i++){
		int x,y;
		scanf("%d%d",&x,&y);
		isCity[x][y]=true;
	}
	for(int i=0;i<playerCount;i++){
		scanf("%d%d",&gen_x[i],&gen_y[i]);
	}
	for(int i=0;i<playerCount;i++){
		int id;
		scanf("%d",&id);
		scanf("%d%d",&total[id],&tiles[id]);
	}
	for(int _=0;_<5000;_++){
		int x=rand()%height,y=rand()%width;
		if(armies[x][y]<=1){
			continue;
		}
		if(terrain[x][y]!=playerIndex){
			continue;
		}
		int endX=x,endY=y;
		double r=(double)rand()/RAND_MAX;
		if(r<0.25&&y>0){
			endY--;
		}
		else if(r<0.5&&y<width-1){
			endY++;
		}
		else if(r<0.75&&x>0){
			endX--;
		}
		else if(x<height-1){
			endX++;
		}
		if(terrain[endX][endY]==TILE_MOUNTAIN){
			continue;
		}
		if(terrain[endX][endY]==playerIndex){
			if(_<1000){
				continue;
			}
			if(armies[x][y]<armies[endX][endY]){
				continue;
			}
		}else{
			if(armies[endX][endY]>=armies[x][y]-1){
				continue;
			}
		}
		printf("attack %d %d %d %d false\n",x,y,endX,endY);
		fflush(stdout);
		break;
	}
};
void game_lost(){
	int killer;
	scanf("%d",&killer);
	printf("# Defeated by %s\n",player_names[killer]);
	printf("leave_game\n");
	fflush(stdout);
}
void game_won(){
	printf("leave_game\n");
	fflush(stdout);
}
int main(){
	scanf("%s",buf);
	assert(!strcmp(buf,"connect"));
	printf("set_username %s %s\n",user_id,user_name);
	while(true){
		printf("join_private %s %s\n",custom_game_id,user_id);
		printf("# Joined custom game at http://bot.generals.io/games/%s\n",custom_game_id);
		fflush(stdout);
		sleep(2);
		printf("set_force_start %s true\n",custom_game_id);
		fflush(stdout);
		while(true){
			scanf("%s",buf);
			if(!strcmp(buf,"disconnect")){
				return 1;
			}
			else if(!strcmp(buf,"game_start")){
				game_start();
			}
			else if(!strcmp(buf,"game_update")){
				game_update();
			}
			else if(!strcmp(buf,"game_lost")){
				game_lost();
				break;
			}
			else if(!strcmp(buf,"game_won")){
				game_won();
				break;
			}
		}
	}
	printf("quit\n");
	fflush(stdout);
	return 0;
}