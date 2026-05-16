<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        $users = [
            [
                'name' => 'User 1',
                'email' => 'user1@webtech.id',
                'password' => Hash::make('password1'),
            ],
            [
                'name' => 'User 2',
                'email' => 'user2@webtech.id',
                'password' => Hash::make('password2'),
            ],
            [
                'name' => 'User 3',
                'email' => 'user3@worldskills.org',
                'password' => Hash::make('password3'),
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
