<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('users')->insert([
            'name' => 'User 1',
            'email' => 'user1@techmart.id',
            'password' => Hash::make('password1'),
        ]);
        DB::table('users')->insert([
            'name' => 'User 2',
            'email' => 'user2@techmart.id',
            'password' => Hash::make('password2'),
        ]);
        DB::table('users')->insert([
            'name' => 'User 3',
            'email' => 'user3@techmart.id',
            'password' => Hash::make('password3'),
        ]);
    }
}
